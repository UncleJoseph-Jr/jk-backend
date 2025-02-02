import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

@Injectable()
export class MerchantsService {
  constructor(private prisma: PrismaService) {}

  //   async create(data: CreateMerchantDto) {
  //     return this.prisma.merchant.create({ data });
  //   }

  async create(data: CreateMerchantDto, ownerId: number) {
    return this.prisma.merchant.create({
      data: {
        name: data.name,
        category: null,
        description: data.description,
        contactNumber: data.contactNumber,
        email: data.email,
        address: data.address,
        storeLogo: data.storeLogo,
        status: data.status ?? 'PENDING',
        owner: { connect: { id: ownerId } },
      },
    });
  }

  async findAll() {
    return this.prisma.merchant.findMany({ include: { category: true } });
  }

  async findOne(id: number) {
    return this.prisma.merchant.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async update(id: number, data: UpdateMerchantDto) {
    return this.prisma.merchant.update({ where: { id }, data });
  }

  async updateCategory(merchantId: number, categoryId: number) {
    return this.prisma.merchant.update({
        where: { id: merchantId },
        data: {
            category: {
                connect: { id: categoryId }
            }
        }
    });
  }

  async remove(id: number) {
    return this.prisma.merchant.delete({ where: { id } });
  }
}
