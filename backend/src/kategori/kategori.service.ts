import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKategoriDto, UpdateKategoriDto } from './kategori.dto';

@Injectable()
export class KategoriService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.kategori.findMany({
      include: { _count: { select: { menu: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: number) {
    const kategori = await this.prisma.kategori.findUnique({
      where: { id },
      include: { menu: { where: { tersedia: true } } },
    });
    if (!kategori) throw new NotFoundException('Kategori tidak ditemukan');
    return kategori;
  }

  async create(dto: CreateKategoriDto) {
    const existing = await this.prisma.kategori.findUnique({ where: { nama: dto.nama } });
    if (existing) throw new ConflictException('Kategori sudah ada');
    return this.prisma.kategori.create({ data: dto });
  }

  async update(id: number, dto: UpdateKategoriDto) {
    await this.findOne(id);
    return this.prisma.kategori.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.kategori.delete({ where: { id } });
  }
}
