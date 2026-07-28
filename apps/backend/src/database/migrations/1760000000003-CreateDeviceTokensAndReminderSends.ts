import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from 'typeorm';

export class CreateDeviceTokensAndReminderSends1760000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
      true,
    );

    await queryRunner.createForeignKey(
      'device_tokens',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
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
      true,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('reminder_sends', true);
    await queryRunner.dropTable('device_tokens', true);
  }
}
