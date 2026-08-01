import { IsString, Matches } from 'class-validator';

export class UpdateUserSettingsDto {
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'reminderTime must be in 24h HH:mm format',
  })
  reminderTime!: string;
}
