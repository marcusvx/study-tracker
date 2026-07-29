import { StudyItem } from '../types/study';

export interface ETAResult {
  daysLeft: number;
  onTrack: boolean;
  etaDate: Date;
}

export function calcETA(item: StudyItem): ETAResult {
  // No total scope (Prática with no fixed goal) means there's no ceiling to
  // fall behind on.
  if (item.totalScope == null)
    return { daysLeft: Infinity, onTrack: true, etaDate: new Date(9999, 0) };

  const remaining = item.totalScope - item.currentProgress;
  if (remaining <= 0)
    return { daysLeft: 0, onTrack: true, etaDate: new Date() };

  const avg =
    item.log.length > 0
      ? item.log.reduce((s, e) => s + e.amount, 0) / item.log.length
      : 0;

  if (avg <= 0)
    return { daysLeft: Infinity, onTrack: false, etaDate: new Date(9999, 0) };

  const sessionsNeeded = Math.ceil(remaining / avg);
  const daysNeeded = sessionsNeeded * item.cadenceDays;
  const etaDate = new Date(Date.now() + daysNeeded * 86400000);
  const onTrack = item.deadline ? etaDate <= new Date(item.deadline) : true;

  return { daysLeft: daysNeeded, onTrack, etaDate };
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
}

export function pct(item: StudyItem): number {
  if (item.totalScope == null || item.totalScope <= 0) return 0;
  return Math.min(
    100,
    Math.round((item.currentProgress / item.totalScope) * 100),
  );
}

function urgencyTier(item: StudyItem): number {
  if (item.status === 'done') return 3;
  if (item.status === 'paused') return 2;
  return calcETA(item).onTrack ? 1 : 0;
}

const toFiniteDays = (days: number): number =>
  Number.isFinite(days) ? days : Number.MAX_SAFE_INTEGER;

/**
 * Overdue/behind-pace active items first, on-pace active items next, paused
 * after that, done last. Only compares tier + days-left — ties fall back to
 * the input's existing order (Array.prototype.sort is stable, and the API
 * already returns items newest-first), so no explicit date tiebreaker is
 * needed.
 */
export function sortByUrgency(items: StudyItem[]): StudyItem[] {
  return [...items].sort((a, b) => {
    const tierDiff = urgencyTier(a) - urgencyTier(b);
    if (tierDiff !== 0) return tierDiff;
    return (
      toFiniteDays(calcETA(a).daysLeft) - toFiniteDays(calcETA(b).daysLeft)
    );
  });
}

export function startOfWeek(d: Date): Date {
  const day = d.getDay(); // 0 (Sun) .. 6 (Sat)
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(d);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() + diffToMonday);
  return monday;
}

/** Sum of minutes logged this week (Monday–now) across active items. */
export function weeklyMinutes(items: StudyItem[]): number {
  const start = startOfWeek(new Date());
  return items
    .filter((i) => i.status === 'active')
    .flatMap((i) => i.log)
    .filter((l) => new Date(l.date) >= start)
    .reduce((sum, l) => sum + l.minutes, 0);
}
