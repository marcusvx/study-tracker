import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProgressLogEntity } from '../progress-logs/progress-log.entity';

export type Category = 'book' | 'course' | 'practice';
export type Unit = 'pages' | '%' | 'hours' | 'modules';
export type Status = 'active' | 'paused' | 'done';

@Entity('study_items')
export class StudyItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** Supabase Auth user id (auth.users.id / JWT `sub`). FK enforced in DB. */
  @Column({ type: 'uuid' })
  userId!: string;

  @Column()
  title!: string;

  @Column({ type: 'varchar', default: 'book' })
  category!: Category;

  @Column({ type: 'varchar', default: 'pages' })
  unit!: Unit;

  @Column({ type: 'float', nullable: true })
  totalScope?: number;

  @Column({ type: 'float', default: 0 })
  currentProgress!: number;

  @Column({ nullable: true })
  deadline?: string;

  @Column({ type: 'int', default: 1 })
  cadenceDays!: number;

  @Column({ type: 'int', default: 30 })
  sessionMinutes!: number;

  @Column({ nullable: true })
  reminderTime?: string;

  @Column({ default: true })
  notificationsOn!: boolean;

  @Column({ type: 'varchar', default: 'active' })
  status!: Status;

  @OneToMany(() => ProgressLogEntity, (log) => log.studyItem)
  log!: ProgressLogEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
