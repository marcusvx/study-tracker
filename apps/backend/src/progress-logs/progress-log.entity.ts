import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { StudyItemEntity } from '../study-items/study-item.entity';

@Entity('progress_logs')
export class ProgressLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  date!: string;

  @Column({ type: 'float' })
  amount!: number;

  @Column({ type: 'int' })
  minutes!: number;

  @Column({ nullable: true })
  note?: string;

  @ManyToOne(() => StudyItemEntity, (item) => item.log, { onDelete: 'CASCADE' })
  studyItem!: StudyItemEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
