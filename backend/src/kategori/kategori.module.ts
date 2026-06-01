import { Module } from '@nestjs/common';
import { KategoriService } from './kategori.service';
import { KategoriController } from './kategori.controller';

@Module({
  providers: [KategoriService],
  controllers: [KategoriController],
})
export class KategoriModule {}
