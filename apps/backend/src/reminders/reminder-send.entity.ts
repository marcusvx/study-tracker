import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { StudyItemEntity } from '../study-items/study-item.entity';

@Entity('reminder_sends')
@Unique('UQ_reminder_sends_item_date', ['studyItemId', 'sentForDate'])
export class ReminderSendEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  studyItemId!: string;

  @ManyToOne(() => StudyItemEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studyItemId' })
  studyItem!: StudyItemEntity;

  /** Calendar date in REMINDERS_TIMEZONE (YYYY-MM-DD). */
  @Column({ type: 'date' })
  sentForDate!: string;

  @CreateDateColumn({ name: 'sentAt' })
  sentAt!: Date;
}
