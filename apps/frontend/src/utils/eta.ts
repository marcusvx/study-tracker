import { StudyItem } from '../types/study';

export interface ETAResult {
  daysLeft: number;
  onTrack: boolean;
  etaDate: Date;
}

export function calcETA(item: StudyItem): ETAResult {
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
  if (item.totalScope <= 0) return 0;
  return Math.min(
    100,
    Math.round((item.currentProgress / item.totalScope) * 100),
  );
}
