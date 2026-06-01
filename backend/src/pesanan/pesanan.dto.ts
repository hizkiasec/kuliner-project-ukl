import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { StatusPesanan } from '@prisma/client';

export class CreatePesananItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  menuId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  jumlah: number;

  @ApiPropertyOptional({ example: 'Tidak pedas' })
  @IsString()
  @IsOptional()
  catatan?: string;
}

export class CreatePesananDto {
  @ApiProperty({ example: 5 })
  @IsInt()
  @IsPositive()
  noMeja: number;

  @ApiPropertyOptional({ example: 'Tolong cepat' })
  @IsString()
  @IsOptional()
  catatan?: string;

  @ApiProperty({ type: [CreatePesananItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePesananItemDto)
  items: CreatePesananItemDto[];
}

export class UpdateStatusPesananDto {
  @ApiProperty({ enum: StatusPesanan })
  @IsEnum(StatusPesanan)
  status: StatusPesanan;
}
