import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import i18n from '../i18n';
import type { StudyItem } from '../types/study';

const DAILY_REMINDER_ID = 1;

async function ensurePermission(): Promise<boolean> {
  const current = await LocalNotifications.checkPermissions();
  if (current.display === 'granted') return true;
  if (current.display === 'denied') return false;
  const requested = await LocalNotifications.requestPermissions();
  return requested.display === 'granted';
}

/**
 * Reconciles the on-device local notification with the current study items
 * and the user's single global reminder time. There is no remote push path
 * (would require a paid Apple Developer account for APNs), so this fires one
 * daily repeating notification — combining all active items with
 * notificationsOn — entirely on-device, instead of one per item.
 */
export async function syncStudyReminders(
  items: StudyItem[],
  reminderTime: string,
): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const granted = await ensurePermission();

    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({
        notifications: pending.notifications.map((n) => ({ id: n.id })),
      });
    }

    if (!granted) return;

    const eligible = items.filter(
      (item) => item.status === 'active' && item.notificationsOn,
    );
    if (eligible.length === 0) return;

    const [hour, minute] = reminderTime.split(':').map(Number);
    await LocalNotifications.schedule({
      notifications: [
        {
          id: DAILY_REMINDER_ID,
          title: i18n.t('reminders.pushTitle'),
          body:
            eligible.length === 1
              ? i18n.t('reminders.pushBodyOne', { title: eligible[0].title })
              : i18n.t('reminders.pushBodyMany', { count: eligible.length }),
          schedule: { on: { hour, minute }, allowWhileIdle: true },
        },
      ],
    });
  } catch (err) {
    console.error('Error syncing local notifications:', err);
  }
}
