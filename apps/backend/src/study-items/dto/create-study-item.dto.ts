import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  ValidateIf,
} from 'class-validator';
import { Category, Unit, Status } from '../study-item.entity';

export class CreateStudyItemDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsEnum(['book', 'course', 'practice'])
  @IsOptional()
  category?: Category;

  @IsEnum(['pages', '%', 'hours', 'modules'])
  @IsOptional()
  unit?: Unit;

  // Required unless category is 'practice' (a time-tracking goal, not a hard
  // ceiling); if a value is supplied for 'practice' it's still validated.
  @ValidateIf(
    (o: CreateStudyItemDto) =>
      o.category !== 'practice' || o.totalScope !== undefined,
  )
  @IsNumber()
  @Min(0.01)
  totalScope?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  currentProgress?: number;

  @IsString()
  @IsOptional()
  deadline?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  cadenceDays?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  sessionMinutes?: number;

  @IsString()
  @IsOptional()
  reminderTime?: string;

  @IsBoolean()
  @IsOptional()
  notificationsOn?: boolean;

  @IsEnum(['active', 'paused', 'done'])
  @IsOptional()
  status?: Status;
}
