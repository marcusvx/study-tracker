import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateStudyItemsAndProgressLogs1760000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
            isNullable: false,
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
            name: 'reminderTime',
            type: 'varchar',
            isNullable: true,
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
      true,
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
      true,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('progress_logs', true);
    await queryRunner.dropTable('study_items', true);
  }
}
