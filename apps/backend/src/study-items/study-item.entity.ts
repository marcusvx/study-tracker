import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProgressLogEntity } from '../progress-logs/progress-log.entity';
import { UserEntity } from '../users/user.entity';

export type Category = 'book' | 'cert' | 'course' | 'work';
export type Unit = 'pages' | '%' | 'hours' | 'modules';
export type Status = 'active' | 'paused' | 'done';

@Entity('study_items')
export class StudyItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.studyItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column()
  title!: string;

  @Column({ type: 'varchar', default: 'book' })
  category!: Category;

  @Column({ type: 'varchar', default: 'pages' })
  unit!: Unit;

  @Column({ type: 'float' })
  totalScope!: number;

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

  @OneToMany(() => ProgressLogEntity, (log) => log.studyItem, { cascade: true })
  log!: ProgressLogEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
