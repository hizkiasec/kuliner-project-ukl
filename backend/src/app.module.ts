import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { KategoriModule } from './kategori/kategori.module';
import { PesananModule } from './pesanan/pesanan.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    MenuModule,
    KategoriModule,
    PesananModule,
  ],
})
export class AppModule {}
