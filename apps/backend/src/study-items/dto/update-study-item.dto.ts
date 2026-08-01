import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';
import { Category, Unit, Status } from '../study-item.entity';

export class UpdateStudyItemDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(['book', 'course', 'practice'])
  @IsOptional()
  category?: Category;

  @IsEnum(['pages', '%', 'hours', 'modules'])
  @IsOptional()
  unit?: Unit;

  @IsNumber()
  @Min(0.01)
  @IsOptional()
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

  @IsBoolean()
  @IsOptional()
  notificationsOn?: boolean;

  @IsEnum(['active', 'paused', 'done'])
  @IsOptional()
  status?: Status;
}
