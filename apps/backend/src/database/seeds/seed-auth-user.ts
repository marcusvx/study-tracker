import { DataSource } from 'typeorm';
import { SeedResult } from './seed-records';

export function requireSeedUserId(): string {
  const userId = process.env.SEED_USER_ID?.trim();
  if (!userId) {
    throw new Error(
      'SEED_USER_ID is required to seed data (Supabase Auth user UUID)',
    );
  }
  return userId;
}

/**
 * Ensures SEED_USER_ID exists in auth.users.
 * - Supabase: the Auth user must already exist (dashboard / signup).
 * - Local docker stub (id-only table): inserts the row when missing.
 */
export async function seedAuthUser(
  dataSource: DataSource,
): Promise<SeedResult> {
  const id = requireSeedUserId();

  const existing: Array<{ exists: boolean }> = await dataSource.query(
    `SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = $1) AS "exists"`,
    [id],
  );
  if (existing[0]?.exists) {
    return { inserted: 0, skipped: 1 };
  }

  const columns: Array<{ column_name: string }> = await dataSource.query(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'auth' AND table_name = 'users'
      ORDER BY ordinal_position
    `,
  );
  const isLocalStub = columns.length === 1 && columns[0]?.column_name === 'id';

  if (!isLocalStub) {
    throw new Error(
      `SEED_USER_ID ${id} not found in auth.users. Create the user in Supabase Auth first.`,
    );
  }

  await dataSource.query(`INSERT INTO auth.users (id) VALUES ($1)`, [id]);
  return { inserted: 1, skipped: 0 };
}
