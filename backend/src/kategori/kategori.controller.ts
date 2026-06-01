import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { KategoriService } from './kategori.service';
import { CreateKategoriDto, UpdateKategoriDto } from './kategori.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Kategori')
@Controller('kategori')
export class KategoriController {
  constructor(private kategoriService: KategoriService) {}

  @Get()
  @ApiOperation({ summary: 'Ambil semua kategori' })
  findAll() {
    return this.kategoriService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil kategori beserta menu-nya' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.kategoriService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tambah kategori baru (admin)' })
  create(@Body() dto: CreateKategoriDto) {
    return this.kategoriService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update kategori (admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateKategoriDto) {
    return this.kategoriService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hapus kategori (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.kategoriService.remove(id);
  }
}
