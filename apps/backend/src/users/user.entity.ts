import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { StudyItemEntity } from '../study-items/study-item.entity';

@Entity('users')
export class UserEntity {
  /** Matches Supabase Auth JWT `sub`. */
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: true })
  displayName?: string | null;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  settings!: Record<string, unknown>;

  @OneToMany(() => StudyItemEntity, (item) => item.user)
  studyItems!: StudyItemEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
