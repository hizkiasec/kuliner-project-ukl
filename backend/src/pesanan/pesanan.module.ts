import { Module } from '@nestjs/common';
import { PesananService } from './pesanan.service';
import { PesananController } from './pesanan.controller';

@Module({
  providers: [PesananService],
  controllers: [PesananController],
})
export class PesananModule {}
