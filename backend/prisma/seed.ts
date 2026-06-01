import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kuliner.com' },
    update: {},
    create: {
      nama: 'Admin Kuliner',
      email: 'admin@kuliner.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });
  console.log('Admin created:', admin.email);

  // Seed kategori
  const kategoriList = [
    { nama: 'Makanan Utama', deskripsi: 'Hidangan utama nasi dan mie' },
    { nama: 'Minuman', deskripsi: 'Minuman segar dan hangat' },
    { nama: 'Camilan', deskripsi: 'Cemilan dan gorengan' },
    { nama: 'Dessert', deskripsi: 'Makanan penutup dan es krim' },
  ];

  for (const k of kategoriList) {
    await prisma.kategori.upsert({
      where: { nama: k.nama },
      update: {},
      create: k,
    });
  }
  console.log('Kategori seeded');

  // Seed menu
  const kategoriMakanan = await prisma.kategori.findUnique({ where: { nama: 'Makanan Utama' } });
  const kategoriMinuman = await prisma.kategori.findUnique({ where: { nama: 'Minuman' } });
  const kategoriCamilan = await prisma.kategori.findUnique({ where: { nama: 'Camilan' } });
  const kategoriDessert = await prisma.kategori.findUnique({ where: { nama: 'Dessert' } });

  const menuList = [
    { nama: 'Nasi Goreng Spesial', deskripsi: 'Nasi goreng dengan telur, ayam, dan sayuran segar', harga: 25000, kategoriId: kategoriMakanan!.id },
    { nama: 'Mie Ayam Bakso', deskripsi: 'Mie kenyal dengan topping ayam dan bakso sapi', harga: 20000, kategoriId: kategoriMakanan!.id },
    { nama: 'Ayam Bakar Madu', deskripsi: 'Ayam bakar dengan bumbu madu dan rempah pilihan', harga: 35000, kategoriId: kategoriMakanan!.id },
    { nama: 'Soto Ayam', deskripsi: 'Soto ayam bening dengan kuah bening khas Jawa', harga: 22000, kategoriId: kategoriMakanan!.id },
    { nama: 'Es Teh Manis', deskripsi: 'Teh manis dingin segar', harga: 5000, kategoriId: kategoriMinuman!.id },
    { nama: 'Es Jeruk', deskripsi: 'Perasan jeruk segar dengan es', harga: 8000, kategoriId: kategoriMinuman!.id },
    { nama: 'Kopi Susu', deskripsi: 'Kopi arabika dengan susu segar', harga: 15000, kategoriId: kategoriMinuman!.id },
    { nama: 'Jus Alpukat', deskripsi: 'Jus alpukat lembut dengan susu kental manis', harga: 15000, kategoriId: kategoriMinuman!.id },
    { nama: 'Tempe Mendoan', deskripsi: 'Tempe goreng tepung ala Banyumas', harga: 10000, kategoriId: kategoriCamilan!.id },
    { nama: 'Pisang Goreng Keju', deskripsi: 'Pisang goreng crispy dengan taburan keju', harga: 12000, kategoriId: kategoriCamilan!.id },
    { nama: 'Es Krim Cokelat', deskripsi: 'Es krim premium rasa cokelat', harga: 15000, kategoriId: kategoriDessert!.id },
    { nama: 'Pudding Susu', deskripsi: 'Pudding susu lembut dengan karamel', harga: 12000, kategoriId: kategoriDessert!.id },
  ];

  for (const m of menuList) {
    await prisma.menu.create({ data: m });
  }
  console.log('Menu seeded');

  console.log('Seeding selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
