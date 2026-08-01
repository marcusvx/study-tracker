import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export const DEFAULT_REMINDER_TIME = '19:00';

/** One row per user; created on first write, not on account creation. */
@Entity('user_settings')
export class UserSettingEntity {
  /** Supabase Auth user id (auth.users.id / JWT `sub`). FK enforced in DB. */
  @PrimaryColumn({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', default: DEFAULT_REMINDER_TIME })
  reminderTime!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
