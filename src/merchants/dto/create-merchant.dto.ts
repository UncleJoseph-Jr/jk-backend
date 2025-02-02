import { IsString, IsEmail, IsOptional, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { MerchantStatus } from '@prisma/client';

export class CreateMerchantDto {
  @IsString()
  name: string;

  @IsInt()
  @Type(() => Number)
  categoryId: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  storeLogo?: string;

  @IsEnum(MerchantStatus)
  status: MerchantStatus;
}
