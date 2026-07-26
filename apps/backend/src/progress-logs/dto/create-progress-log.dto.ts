import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProgressLogDto {
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsNumber()
  @Min(1)
  minutes!: number;

  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
