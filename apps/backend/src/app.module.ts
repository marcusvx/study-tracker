import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './database/typeorm.config';
import { HealthController } from './health/health.controller';
import { MessagesModule } from './messages/messages.module';
import { StudyItemsModule } from './study-items/study-items.module';
import { ProgressLogsModule } from './progress-logs/progress-logs.module';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    MessagesModule,
    StudyItemsModule,
    ProgressLogsModule,
  ],
})
export class AppModule {}
