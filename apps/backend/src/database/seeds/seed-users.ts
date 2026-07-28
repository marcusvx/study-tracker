import { DataSource } from 'typeorm';
import { UserEntity } from '../../users/user.entity';
import { SeedResult, seedRecords } from './seed-records';

/** Stable demo profile used by other seeds. Id must match a Supabase Auth user. */
export const SEED_USER = {
  displayName: 'Demo User',
  settings: {} as Record<string, unknown>,
};

export function requireSeedUserId(): string {
  const userId = process.env.SEED_USER_ID?.trim();
  if (!userId) {
    throw new Error(
      'SEED_USER_ID is required to seed users (Supabase Auth user UUID)',
    );
  }
  return userId;
}

export async function seedUsers(dataSource: DataSource): Promise<SeedResult> {
  const id = requireSeedUserId();

  return seedRecords(dataSource, UserEntity, [
    {
      where: { id },
      data: {
        id,
        displayName: SEED_USER.displayName,
        settings: SEED_USER.settings,
      },
    },
  ]);
}
