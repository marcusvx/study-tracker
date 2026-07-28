import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StudyItemEntity } from '../study-items/study-item.entity';
import { DeviceTokensService } from '../device-tokens/device-tokens.service';
import { DeviceTokenEntity } from '../device-tokens/device-token.entity';
import { AppLogger, withSpan } from '../telemetry/app-logger';
import { ReminderSendEntity } from './reminder-send.entity';
import {
  computeReminderWindow,
  isReminderInWindow,
  type ReminderWindow,
} from './reminder-time.util';

export interface PendingReminder {
  studyItemId: string;
  userId: string;
  title: string;
  reminderTime: string;
  tokenCount: number;
}

export interface ReminderScanResult {
  window: ReminderWindow;
  pending: PendingReminder[];
  skippedAlreadySent: number;
  skippedNoToken: number;
}

export interface ReminderDispatchResult extends ReminderScanResult {
  recorded: number;
  /** Push provider not wired yet — listed so callers can see what would go out. */
  delivery: 'recorded_only';
}

@Injectable()
export class RemindersService {
  private readonly logger = new AppLogger(RemindersService.name);

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(StudyItemEntity)
    private readonly studyItemRepo: Repository<StudyItemEntity>,
    @InjectRepository(ReminderSendEntity)
    private readonly reminderSendRepo: Repository<ReminderSendEntity>,
    private readonly deviceTokensService: DeviceTokensService,
  ) {}

  async findPending(now = new Date()): Promise<ReminderScanResult> {
    return withSpan('reminders.findPending', async (span) => {
      const window = this.getWindow(now);
      span.setAttributes({
        'reminders.timezone': window.timeZone,
        'reminders.sent_for_date': window.sentForDate,
        'reminders.window_start': window.windowStart,
        'reminders.window_end': window.windowEnd,
      });

      this.logger.info('Scanning for pending reminders', {
        'reminders.timezone': window.timeZone,
        'reminders.sent_for_date': window.sentForDate,
        'reminders.window_start': window.windowStart,
        'reminders.window_end': window.windowEnd,
      });

      const candidates = await this.studyItemRepo.find({
        where: {
          notificationsOn: true,
          status: 'active',
        },
      });

      const due = candidates.filter(
        (item) =>
          Boolean(item.reminderTime) &&
          isReminderInWindow(
            item.reminderTime!,
            window.windowStart,
            window.windowEnd,
          ),
      );

      span.setAttribute('reminders.candidates', candidates.length);
      span.setAttribute('reminders.due', due.length);

      if (due.length === 0) {
        this.logger.info('No reminders due in current window', {
          'reminders.candidates': candidates.length,
          'reminders.due': 0,
        });
        return {
          window,
          pending: [],
          skippedAlreadySent: 0,
          skippedNoToken: 0,
        };
      }

      const dueIds = due.map((item) => item.id);
      const alreadySent = await this.reminderSendRepo.find({
        where: {
          studyItemId: In(dueIds),
          sentForDate: window.sentForDate,
        },
      });
      const sentIds = new Set(alreadySent.map((row) => row.studyItemId));
      const notYetSent = due.filter((item) => !sentIds.has(item.id));
      const skippedAlreadySent = due.length - notYetSent.length;

      const userIds = [...new Set(notYetSent.map((item) => item.userId))];
      const tokens = await this.deviceTokensService.findByUserIds(userIds);
      const tokensByUser = groupTokensByUser(tokens);

      const pending: PendingReminder[] = [];
      let skippedNoToken = 0;

      for (const item of notYetSent) {
        const userTokens = tokensByUser.get(item.userId) ?? [];
        if (userTokens.length === 0) {
          skippedNoToken += 1;
          this.logger.debug('Skipping reminder: no device tokens', {
            'study_item.id': item.id,
            'user.id': item.userId,
          });
          continue;
        }
        pending.push({
          studyItemId: item.id,
          userId: item.userId,
          title: item.title,
          reminderTime: item.reminderTime!,
          tokenCount: userTokens.length,
        });
      }

      span.setAttributes({
        'reminders.pending': pending.length,
        'reminders.skipped_already_sent': skippedAlreadySent,
        'reminders.skipped_no_token': skippedNoToken,
      });

      this.logger.info('Reminder scan complete', {
        'reminders.candidates': candidates.length,
        'reminders.due': due.length,
        'reminders.pending': pending.length,
        'reminders.skipped_already_sent': skippedAlreadySent,
        'reminders.skipped_no_token': skippedNoToken,
      });

      return {
        window,
        pending,
        skippedAlreadySent,
        skippedNoToken,
      };
    });
  }

  async dispatch(now = new Date()): Promise<ReminderDispatchResult> {
    return withSpan('reminders.dispatch', async (span) => {
      this.logger.info('Reminder dispatch started');

      const scan = await this.findPending(now);
      let recorded = 0;
      let insertConflicts = 0;

      for (const item of scan.pending) {
        try {
          await this.reminderSendRepo.insert({
            studyItemId: item.studyItemId,
            sentForDate: scan.window.sentForDate,
          });
          recorded += 1;
          this.logger.info('Reminder send recorded', {
            'study_item.id': item.studyItemId,
            'user.id': item.userId,
            'reminders.sent_for_date': scan.window.sentForDate,
            'reminders.reminder_time': item.reminderTime,
            'reminders.token_count': item.tokenCount,
            'reminders.delivery': 'recorded_only',
          });
        } catch (err) {
          // Unique (studyItemId, sentForDate) — concurrent dispatch or race.
          insertConflicts += 1;
          this.logger.warn('Skipped recording reminder (already sent or insert failed)', {
            'study_item.id': item.studyItemId,
            'user.id': item.userId,
            'error.name': err instanceof Error ? err.name : 'Error',
          });
        }
      }

      // FCM/APNs delivery will plug in here later.
      span.setAttributes({
        'reminders.pending': scan.pending.length,
        'reminders.recorded': recorded,
        'reminders.insert_conflicts': insertConflicts,
        'reminders.skipped_already_sent': scan.skippedAlreadySent,
        'reminders.skipped_no_token': scan.skippedNoToken,
        'reminders.delivery': 'recorded_only',
      });

      this.logger.info('Reminder dispatch finished', {
        'reminders.recorded': recorded,
        'reminders.pending': scan.pending.length,
        'reminders.insert_conflicts': insertConflicts,
        'reminders.skipped_already_sent': scan.skippedAlreadySent,
        'reminders.skipped_no_token': scan.skippedNoToken,
        'reminders.window_start': scan.window.windowStart,
        'reminders.window_end': scan.window.windowEnd,
        'reminders.delivery': 'recorded_only',
      });

      return {
        ...scan,
        recorded,
        delivery: 'recorded_only',
      };
    });
  }

  private getWindow(now: Date): ReminderWindow {
    const timeZone =
      this.config.get<string>('REMINDERS_TIMEZONE')?.trim() ||
      'America/Sao_Paulo';
    const rawWindow = this.config.get<string>('REMINDERS_WINDOW_MINUTES');
    const parsed = rawWindow ? Number(rawWindow) : 5;
    const windowMinutes =
      Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 5;

    return computeReminderWindow(now, timeZone, windowMinutes);
  }
}

function groupTokensByUser(
  tokens: DeviceTokenEntity[],
): Map<string, DeviceTokenEntity[]> {
  const map = new Map<string, DeviceTokenEntity[]>();
  for (const token of tokens) {
    const list = map.get(token.userId) ?? [];
    list.push(token);
    map.set(token.userId, list);
  }
  return map;
}
