import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthUserService {
  private localStubCache: boolean | null = null;
  private readonly ensuredUserIds = new Set<string>();

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Local docker uses a minimal auth.users stub for FK constraints.
   * Supabase Auth users live in the cloud, so mirror the JWT sub locally
   * on first authenticated request.
   */
  async ensureExists(userId: string): Promise<void> {
    if (!(await this.isLocalAuthStub())) {
      return;
    }

    if (this.ensuredUserIds.has(userId)) {
      return;
    }

    await this.dataSource.query(
      `INSERT INTO auth.users (id) VALUES ($1) ON CONFLICT (id) DO NOTHING`,
      [userId],
    );
    this.ensuredUserIds.add(userId);
  }

  private async isLocalAuthStub(): Promise<boolean> {
    if (this.localStubCache !== null) {
      return this.localStubCache;
    }

    const columns: Array<{ column_name: string }> = await this.dataSource.query(
      `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'auth' AND table_name = 'users'
        ORDER BY ordinal_position
      `,
    );

    this.localStubCache =
      columns.length === 1 && columns[0]?.column_name === 'id';
    return this.localStubCache;
  }
}
