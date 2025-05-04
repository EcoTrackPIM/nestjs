import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { Logindto } from './login.dto';
import { registerdto } from './register.dto';

import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateAuthDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  Phone_number?: string;

  @IsOptional()
  @IsString()
  Address?: string;

  @IsOptional()
  @IsNumber()
  Age?: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  profileImage?: string; // Add this line
}