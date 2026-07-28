/**
 * Reminder window helpers. reminderTime is stored as HH:mm (24h) without TZ;
 * interpretation uses REMINDERS_TIMEZONE.
 */

export interface ReminderWindow {
  /** YYYY-MM-DD in the reminders timezone. */
  sentForDate: string;
  /** HH:mm exclusive lower bound. */
  windowStart: string;
  /** HH:mm inclusive upper bound (usually "now" floored to the minute). */
  windowEnd: string;
  windowMinutes: number;
  timeZone: string;
}

export function computeReminderWindow(
  now: Date,
  timeZone: string,
  windowMinutes: number,
): ReminderWindow {
  const windowEnd = formatTimeHm(now, timeZone);
  const endMinutes = timeToMinutes(windowEnd);
  const windowStart = minutesToTime(endMinutes - windowMinutes);
  const sentForDate = formatDateYmd(now, timeZone);

  return {
    sentForDate,
    windowStart,
    windowEnd,
    windowMinutes,
    timeZone,
  };
}

/** Exclusive start, inclusive end. Handles midnight wrap. */
export function isReminderInWindow(
  reminderTime: string,
  windowStart: string,
  windowEnd: string,
): boolean {
  if (windowStart <= windowEnd) {
    return reminderTime > windowStart && reminderTime <= windowEnd;
  }
  return reminderTime > windowStart || reminderTime <= windowEnd;
}

export function timeToMinutes(hm: string): number {
  const [hours, minutes] = hm.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number): string {
  const day = 24 * 60;
  const normalized = ((totalMinutes % day) + day) % day;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function formatTimeHm(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const hour = parts.find((p) => p.type === 'hour')?.value ?? '00';
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';
  // en-GB can yield "24" for midnight in some engines — normalize to 00.
  const normalizedHour = hour === '24' ? '00' : hour;
  return `${normalizedHour}:${minute}`;
}

function formatDateYmd(date: Date, timeZone: string): string {
  // en-CA → YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
