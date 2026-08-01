import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from 'typeorm';

export class InitSchema1760000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Local docker has no Auth schema; Supabase already has auth.users.
    // Only create a minimal stub when missing — never touch a real Auth table.
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.schemata
          WHERE schema_name = 'auth'
        ) THEN
          CREATE SCHEMA auth;
        END IF;

        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = 'auth' AND table_name = 'users'
        ) THEN
          CREATE TABLE auth.users (id uuid PRIMARY KEY);
        END IF;
      END $$;
    `);

    await queryRunner.createTable(
      new Table({
        name: 'study_items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuidv7()',
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'category',
            type: 'varchar',
            default: "'book'",
          },
          {
            name: 'unit',
            type: 'varchar',
            default: "'pages'",
          },
          {
            name: 'totalScope',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'currentProgress',
            type: 'float',
            default: 0,
          },
          {
            name: 'deadline',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cadenceDays',
            type: 'int',
            default: 1,
          },
          {
            name: 'sessionMinutes',
            type: 'int',
            default: 30,
          },
          {
            name: 'notificationsOn',
            type: 'boolean',
            default: true,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'active'",
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'study_items',
      new TableForeignKey({
        name: 'FK_study_items_userId_auth_users',
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        referencedSchema: 'auth',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'progress_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuidv7()',
          },
          {
            name: 'date',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'minutes',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'note',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'studyItemId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'progress_logs',
      new TableForeignKey({
        columnNames: ['studyItemId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'study_items',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'device_tokens',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuidv7()',
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'token',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'platform',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
        ],
        uniques: [
          new TableUnique({
            name: 'UQ_device_tokens_token',
            columnNames: ['token'],
          }),
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'device_tokens',
      new TableForeignKey({
        name: 'FK_device_tokens_userId_auth_users',
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        referencedSchema: 'auth',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'device_tokens',
      new TableIndex({
        name: 'IDX_device_tokens_userId',
        columnNames: ['userId'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'reminder_sends',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuidv7()',
          },
          {
            name: 'studyItemId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'sentForDate',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'sentAt',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
        ],
        uniques: [
          new TableUnique({
            name: 'UQ_reminder_sends_item_date',
            columnNames: ['studyItemId', 'sentForDate'],
          }),
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'reminder_sends',
      new TableForeignKey({
        columnNames: ['studyItemId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'study_items',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'user_settings',
        columns: [
          {
            name: 'userId',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'reminderTime',
            type: 'varchar',
            default: "'19:00'",
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'user_settings',
      new TableForeignKey({
        name: 'FK_user_settings_userId_auth_users',
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        referencedSchema: 'auth',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_settings', true);
    await queryRunner.dropTable('reminder_sends', true);
    await queryRunner.dropTable('device_tokens', true);
    await queryRunner.dropTable('progress_logs', true);
    await queryRunner.dropTable('study_items', true);
    // Do not drop auth.users — it may be the real Supabase Auth table.
  }
}
