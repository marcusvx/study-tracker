import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceTokenEntity } from './device-token.entity';
import { DeviceTokensService } from './device-tokens.service';
import { DeviceTokensController } from './device-tokens.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceTokenEntity])],
  providers: [DeviceTokensService],
  controllers: [DeviceTokensController],
  exports: [DeviceTokensService],
})
export class DeviceTokensModule {}
