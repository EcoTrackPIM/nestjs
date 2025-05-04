// src/events/dto/create-event.dto.ts
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    IsEnum,
    IsBoolean,
    IsDate,
    IsArray,
    IsMongoId,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @IsOptional()
    @IsString()
    image?: string;
  
    @IsNumber()
    latitude: number;
  
    @IsNumber()
    longitude: number;
  
    @IsDate()
    @Type(() => Date)
    startTime: Date;
  
    @IsDate()
    @Type(() => Date)
    endTime: Date;
  
    @IsOptional()
    @IsNumber()
    maxParticipants?: number;
  
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    participants?: string[];
  
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    registrationDeadline?: Date;
  
    
  
    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;
  
    @IsOptional()
    @IsNumber()
    pointsAwarded?: number;
  
    @IsOptional()
    @IsBoolean()
    certificateAvailable?: boolean;
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    badges?: string[];
  
    @IsOptional()
    @IsString()
    chatRoomId?: string;
  
    @IsOptional()
    @IsString()
    organizerContact?: string;
  
    @IsOptional()
    customFields?: Record<string, any>;
  }  