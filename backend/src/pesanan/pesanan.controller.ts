import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PesananService } from './pesanan.service';
import { CreatePesananDto, UpdateStatusPesananDto } from './pesanan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Pesanan')
@Controller('pesanan')
export class PesananController {
  constructor(private pesananService: PesananService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ambil semua pesanan (admin)' })
  @ApiQuery({ name: 'status', required: false })
  findAll(@Query('status') status?: string) {
    return this.pesananService.findAll(status);
  }

  @Get('saya')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ambil pesanan user yang sedang login' })
  findMine(@Request() req) {
    return this.pesananService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail pesanan' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pesananService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Buat pesanan baru (bisa tanpa login)' })
  create(@Body() dto: CreatePesananDto, @Request() req) {
    const userId = req.user?.id;
    return this.pesananService.create(dto, userId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update status pesanan (admin)' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusPesananDto,
  ) {
    return this.pesananService.updateStatus(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hapus pesanan (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pesananService.remove(id);
  }
}
