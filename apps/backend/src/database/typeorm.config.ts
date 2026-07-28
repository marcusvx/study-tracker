import 'dotenv/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { StudyItemEntity } from '../study-items/study-item.entity';
import { ProgressLogEntity } from '../progress-logs/progress-log.entity';
import { DeviceTokenEntity } from '../device-tokens/device-token.entity';
import { ReminderSendEntity } from '../reminders/reminder-send.entity';

// Local: docker-compose Postgres; production: Supabase connection string.
// Only the latter needs SSL, gated on NODE_ENV rather than on the URL itself.
const baseOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  entities: [
    StudyItemEntity,
    ProgressLogEntity,
    DeviceTokenEntity,
    ReminderSendEntity,
  ],
  synchronize: false,
};

export const typeOrmDataSourceOptions: DataSourceOptions = {
  ...baseOptions,
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
};

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  ...baseOptions,
  autoLoadEntities: true,
};
