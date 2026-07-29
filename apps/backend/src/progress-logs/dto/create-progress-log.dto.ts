import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProgressLogDto {
  // Optional: logging time spent must stand on its own (e.g. "studied a
  // module but didn't finish it") without forcing a minimum advancement.
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

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
