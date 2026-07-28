import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { DevicePlatform } from '../device-token.entity';

export class UpsertDeviceTokenDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(4096)
  token!: string;

  @IsIn(['ios', 'android', 'web'])
  platform!: DevicePlatform;
}
