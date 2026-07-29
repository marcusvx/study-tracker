import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * "Prática" items track time invested toward a goal rather than a hard
 * ceiling, so totalScope is no longer required for them. Reverting requires
 * backfilling nulls (e.g. to 0) first — down() does not do this automatically
 * since picking a value is a product decision, not a safe default.
 */
export class MakeTotalScopeOptional1760000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE study_items ALTER COLUMN "totalScope" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE study_items ALTER COLUMN "totalScope" SET NOT NULL`,
    );
  }
}
