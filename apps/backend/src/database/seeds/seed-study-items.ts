import { DataSource } from 'typeorm';
import { StudyItemEntity } from '../../study-items/study-item.entity';
import { ProgressLogEntity } from '../../progress-logs/progress-log.entity';
import { SeedResult } from './seed-records';

const initialItems = [
  {
    title: 'Designing Data-Intensive Applications',
    category: 'book' as const,
    unit: 'pages' as const,
    totalScope: 562,
    currentProgress: 210,
    deadline: '2026-08-30',
    cadenceDays: 1,
    sessionMinutes: 30,
    reminderTime: '21:00',
    notificationsOn: true,
    status: 'active' as const,
    log: [
      { date: '2026-07-20', amount: 22, minutes: 35, note: 'Cap. 4 completo' },
      { date: '2026-07-21', amount: 18, minutes: 30 },
      { date: '2026-07-22', amount: 25, minutes: 40 },
      { date: '2026-07-23', amount: 20, minutes: 30 },
      { date: '2026-07-24', amount: 28, minutes: 45 },
      { date: '2026-07-25', amount: 15, minutes: 25 },
      { date: '2026-07-26', amount: 22, minutes: 35 },
    ],
  },
  {
    title: 'AWS Solutions Architect Associate',
    category: 'cert' as const,
    unit: '%' as const,
    totalScope: 100,
    currentProgress: 42,
    deadline: '2026-09-15',
    cadenceDays: 1,
    sessionMinutes: 60,
    reminderTime: '07:00',
    notificationsOn: true,
    status: 'active' as const,
    log: [
      { date: '2026-07-22', amount: 8, minutes: 60 },
      { date: '2026-07-23', amount: 6, minutes: 50 },
      { date: '2026-07-24', amount: 10, minutes: 70 },
      { date: '2026-07-25', amount: 9, minutes: 65 },
      { date: '2026-07-26', amount: 9, minutes: 60 },
    ],
  },
  {
    title: 'React 19 Deep Dive — Udemy',
    category: 'course' as const,
    unit: 'modules' as const,
    totalScope: 24,
    currentProgress: 11,
    deadline: '2026-08-10',
    cadenceDays: 2,
    sessionMinutes: 45,
    reminderTime: '19:30',
    notificationsOn: false,
    status: 'active' as const,
    log: [
      { date: '2026-07-18', amount: 2, minutes: 50 },
      { date: '2026-07-20', amount: 2, minutes: 45 },
      { date: '2026-07-22', amount: 3, minutes: 60 },
      { date: '2026-07-24', amount: 2, minutes: 40 },
      { date: '2026-07-26', amount: 2, minutes: 45 },
    ],
  },
  {
    title: 'RFC 9110 — HTTP Semantics',
    category: 'work' as const,
    unit: 'pages' as const,
    totalScope: 194,
    currentProgress: 194,
    cadenceDays: 1,
    sessionMinutes: 20,
    notificationsOn: false,
    status: 'done' as const,
    log: [
      { date: '2026-07-10', amount: 40, minutes: 30 },
      { date: '2026-07-12', amount: 50, minutes: 35 },
      { date: '2026-07-14', amount: 54, minutes: 40 },
      { date: '2026-07-16', amount: 50, minutes: 30 },
    ],
  },
];

export async function seedStudyItems(
  dataSource: DataSource,
): Promise<SeedResult> {
  const itemRepo = dataSource.getRepository(StudyItemEntity);
  const logRepo = dataSource.getRepository(ProgressLogEntity);

  let inserted = 0;
  let skipped = 0;

  for (const itemData of initialItems) {
    const exists = await itemRepo.existsBy({ title: itemData.title });
    if (exists) {
      skipped++;
      continue;
    }

    const { log, ...itemFields } = itemData;
    const item = itemRepo.create(itemFields);
    const savedItem = await itemRepo.save(item);

    if (log && log.length > 0) {
      const logEntities = log.map((l) =>
        logRepo.create({
          ...l,
          studyItem: savedItem,
        }),
      );
      await logRepo.save(logEntities);
    }
    inserted++;
  }

  return { inserted, skipped };
}
