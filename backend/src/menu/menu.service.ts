import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto, UpdateMenuDto } from './menu.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async findAll(kategoriId?: number, tersedia?: boolean, search?: string) {
    return this.prisma.menu.findMany({
      where: {
        ...(kategoriId && { kategoriId }),
        ...(tersedia !== undefined && { tersedia }),
        ...(search && {
          OR: [
            { nama: { contains: search } },      // mode: 'insensitive' dihapus karena MySQL otomatis case-insensitive
            { deskripsi: { contains: search } }, // mode: 'insensitive' dihapus karena MySQL otomatis case-insensitive
          ],
        }),
      },
      include: { kategori: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: number) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: { kategori: true },
    });
    if (!menu) throw new NotFoundException('Menu tidak ditemukan');
    return menu;
  }

  async create(dto: CreateMenuDto) {
    return this.prisma.menu.create({
      data: dto,
      include: { kategori: true },
    });
  }

  async update(id: number, dto: UpdateMenuDto) {
    await this.findOne(id);
    return this.prisma.menu.update({
      where: { id },
      data: dto,
      include: { kategori: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.menu.delete({ where: { id } });
  }

  async toggleKetersediaan(id: number) {
    const menu = await this.findOne(id);
    return this.prisma.menu.update({
      where: { id },
      data: { tersedia: !menu.tersedia },
    });
  }
}