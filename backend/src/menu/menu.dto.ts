import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMenuDto {
  @ApiProperty({ example: 'Nasi Goreng Spesial' })
  @IsString()
  @IsNotEmpty()
  nama: string;

  @ApiPropertyOptional({ example: 'Nasi goreng dengan telur dan ayam' })
  @IsString()
  @IsOptional()
  deskripsi?: string;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  harga: number;

  @ApiPropertyOptional({ example: 'https://example.com/gambar.jpg' })
  @IsString()
  @IsOptional()
  gambar?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  tersedia?: boolean;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  kategoriId: number;
}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}
