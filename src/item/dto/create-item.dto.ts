import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateItemDto {
  @IsString()
  name: string;
}