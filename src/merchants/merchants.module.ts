import { Module } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { MerchantsController } from './merchants.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [MerchantsService, PrismaService],
  controllers: [MerchantsController]
})
export class MerchantsModule {}
