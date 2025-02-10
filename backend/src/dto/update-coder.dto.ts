import {
        IsString,
        IsEmail,
        IsNumber,
        IsOptional,
        IsEnum,
      } from 'class-validator';
      import { CoderRole } from '../auth/schema/coder.schema';
      
      export class UpdateCoderDto {
        @IsNumber()
        @IsOptional()
        id?: number;
      
        @IsString()
        @IsOptional()
        first_name?: string;
      
        @IsString()
        @IsOptional()
        last_name?: string;
      
        @IsEmail()
        @IsOptional()
        email?: string;
      
        @IsString()
        @IsOptional()
        password?: string;
      
        @IsString()
        @IsOptional()
        avatar?: string;
      
        @IsEnum(CoderRole)
        @IsOptional()
        role?: CoderRole;
      }
      