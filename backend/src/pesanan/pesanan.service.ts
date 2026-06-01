import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePesananDto, UpdateStatusPesananDto } from './pesanan.dto';

@Injectable()
export class PesananService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string) {
    return this.prisma.pesanan.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        user: { select: { id: true, nama: true, email: true } },
        items: {
          include: { menu: { select: { id: true, nama: true, harga: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.pesanan.findMany({
      where: { userId },
      include: {
        items: {
          include: { menu: { select: { id: true, nama: true, harga: true, gambar: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const pesanan = await this.prisma.pesanan.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, nama: true, email: true } },
        items: {
          include: { menu: true },
        },
      },
    });
    if (!pesanan) throw new NotFoundException('Pesanan tidak ditemukan');
    return pesanan;
  }

  async create(dto: CreatePesananDto, userId?: number) {
    // Validasi dan hitung total harga
    let totalHarga = 0;
    const itemsData = [];

    for (const item of dto.items) {
      const menu = await this.prisma.menu.findUnique({ where: { id: item.menuId } });
      if (!menu) throw new BadRequestException(`Menu ID ${item.menuId} tidak ditemukan`);
      if (!menu.tersedia) throw new BadRequestException(`Menu "${menu.nama}" tidak tersedia`);

      const hargaItem = menu.harga * item.jumlah;
      totalHarga += hargaItem;

      itemsData.push({
        menuId: item.menuId,
        jumlah: item.jumlah,
        harga: menu.harga,
        catatan: item.catatan,
      });
    }

    return this.prisma.pesanan.create({
      data: {
        noMeja: dto.noMeja,
        catatan: dto.catatan,
        totalHarga,
        userId: userId || null,
        items: { create: itemsData },
      },
      include: {
        items: { include: { menu: true } },
      },
    });
  }

  async updateStatus(id: number, dto: UpdateStatusPesananDto) {
    await this.findOne(id);
    return this.prisma.pesanan.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.pesanan.delete({ where: { id } });
  }
}
