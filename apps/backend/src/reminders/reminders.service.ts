import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppLogger, withSpan } from '../telemetry/app-logger';
import {
  computeReminderWindow,
  type ReminderWindow,
} from './reminder-time.util';

export interface PendingReminder {
  studyItemId: string;
  userId: string;
  title: string;
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
  /**
   * Per-item reminderTime was replaced by a single per-user reminder time
   * (see the user-settings module), and remote push delivery was dropped in
   * favor of on-device local notifications scheduled by the frontend. This
   * scan/dispatch pair — routes, auth guard, device_tokens/reminder_sends
   * tables — is kept in place to be rebuilt into email dispatch later, but
   * currently does no real work.
   */
  delivery: 'disabled';
}

@Injectable()
export class RemindersService {
  private readonly logger = new AppLogger(RemindersService.name);

  constructor(private readonly config: ConfigService) {}

  async findPending(now = new Date()): Promise<ReminderScanResult> {
    return withSpan('reminders.findPending', async (span) => {
      const window = this.getWindow(now);
      span.setAttributes({
        'reminders.timezone': window.timeZone,
        'reminders.sent_for_date': window.sentForDate,
        'reminders.window_start': window.windowStart,
        'reminders.window_end': window.windowEnd,
        'reminders.delivery': 'disabled',
      });
      this.logger.info('Reminder scan skipped (dispatch disabled)', {
        'reminders.delivery': 'disabled',
      });
      return {
        window,
        pending: [],
        skippedAlreadySent: 0,
        skippedNoToken: 0,
      };
    });
  }

  async dispatch(now = new Date()): Promise<ReminderDispatchResult> {
    return withSpan('reminders.dispatch', async (span) => {
      const scan = await this.findPending(now);
      span.setAttribute('reminders.delivery', 'disabled');
      return {
        ...scan,
        recorded: 0,
        delivery: 'disabled',
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
