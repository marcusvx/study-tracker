import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Collapses the old 4-category model (book/cert/course/work) down to
 * book/course/practice. The old cert/work categories mixed "why you're
 * studying" with "what you're studying"; the replacement is derived from
 * each row's existing `unit`, which uniquely determines the new category
 * except for `%`, which fits both book and course. No known production rows
 * hit that ambiguous case — the `%` branch below is a documented safe
 * fallback (mapped to 'course'), not a silent guess: it raises a NOTICE with
 * the affected row count so it's visible if it ever fires.
 */
export class SimplifyCategories1760000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const ambiguous = (await queryRunner.query(`
      SELECT COUNT(*) FROM study_items
      WHERE category IN ('work', 'cert') AND unit = '%'
    `)) as Array<{ count: string }>;
    const ambiguousCount = Number(ambiguous[0]?.count ?? 0);
    if (ambiguousCount > 0) {
      await queryRunner.query(`
        DO $$
        BEGIN
          RAISE NOTICE
            'SimplifyCategories migration: % row(s) had an ambiguous work/cert + %% unit combo and were defaulted to category=course. Review manually.',
            ${ambiguousCount};
        END $$;
      `);
    }

    await queryRunner.query(`
      UPDATE study_items SET category = CASE unit
        WHEN 'pages' THEN 'book'
        WHEN 'modules' THEN 'course'
        WHEN 'hours' THEN 'practice'
        WHEN '%' THEN 'course'
      END
      WHERE category IN ('work', 'cert')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Not fully reversible: the original book/cert/course/work split can't
    // be recovered once collapsed (a 'book' row today may have started as
    // either 'book' or 'work', and that distinction is gone). Best-effort:
    // send 'practice' rows back to 'work' since that's the only category
    // that was newly introduced; 'book'/'course' rows are left as-is.
    await queryRunner.query(`
      UPDATE study_items SET category = 'work' WHERE category = 'practice'
    `);
  }
}
