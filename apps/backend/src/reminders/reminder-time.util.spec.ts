/**
 * Reminder window helpers unit tests.
 */

import {
  computeReminderWindow,
  isReminderInWindow,
  minutesToTime,
  timeToMinutes,
} from './reminder-time.util';

describe('reminder-time.util', () => {
  describe('timeToMinutes / minutesToTime', () => {
    it('round-trips HH:mm', () => {
      expect(minutesToTime(timeToMinutes('21:00'))).toBe('21:00');
      expect(minutesToTime(timeToMinutes('00:00'))).toBe('00:00');
      expect(minutesToTime(timeToMinutes('23:59'))).toBe('23:59');
    });

    it('wraps negative and overflow minutes', () => {
      expect(minutesToTime(-5)).toBe('23:55');
      expect(minutesToTime(24 * 60 + 1)).toBe('00:01');
    });
  });

  describe('isReminderInWindow', () => {
    it('matches exclusive start and inclusive end', () => {
      expect(isReminderInWindow('21:00', '20:55', '21:00')).toBe(true);
      expect(isReminderInWindow('20:56', '20:55', '21:00')).toBe(true);
      expect(isReminderInWindow('20:55', '20:55', '21:00')).toBe(false);
      expect(isReminderInWindow('21:01', '20:55', '21:00')).toBe(false);
    });

    it('handles midnight wrap', () => {
      expect(isReminderInWindow('23:58', '23:55', '00:00')).toBe(true);
      expect(isReminderInWindow('00:00', '23:55', '00:00')).toBe(true);
      expect(isReminderInWindow('23:55', '23:55', '00:00')).toBe(false);
      expect(isReminderInWindow('12:00', '23:55', '00:00')).toBe(false);
    });
  });

  describe('computeReminderWindow', () => {
    it('builds a 5-minute window ending at now in the given timezone', () => {
      // 2026-07-28 21:00:30 UTC-3 = 2026-07-29 00:00:30Z
      const now = new Date('2026-07-29T00:00:30.000Z');
      const window = computeReminderWindow(now, 'America/Sao_Paulo', 5);

      expect(window.sentForDate).toBe('2026-07-28');
      expect(window.windowEnd).toBe('21:00');
      expect(window.windowStart).toBe('20:55');
    });
  });
});
