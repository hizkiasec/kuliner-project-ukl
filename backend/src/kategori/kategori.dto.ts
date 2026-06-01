import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateKategoriDto {
  @ApiProperty({ example: 'Makanan Utama' })
  @IsString()
  @IsNotEmpty()
  nama: string;

  @ApiPropertyOptional({ example: 'Hidangan utama nasi dan mie' })
  @IsString()
  @IsOptional()
  deskripsi?: string;
}

export class UpdateKategoriDto extends PartialType(CreateKategoriDto) {}
