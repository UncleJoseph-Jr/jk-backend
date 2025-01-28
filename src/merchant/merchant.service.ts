import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MerchantStatus } from '@prisma/client';

@Injectable()
export class MerchantService {
  constructor(private readonly prisma: PrismaService) {}

  async createMerchant(name: string, category: string, ownerId: number) {
    return this.prisma.merchant.create({
      data: {
        name,
        category,
        owner: {
          connect: { id: ownerId },
        },
        status: MerchantStatus.PENDING,
        documents: {},
      },
    });
  }

  async getAllMerchants() {
    return this.prisma.merchant.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getMerchantById(id: number) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return merchant;
  }

  async updateMerchant(id: number, data: { name?: string; category?: string; status?: MerchantStatus }) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return this.prisma.merchant.update({
      where: { id },
      data,
    });
  }

  async deleteMerchant(id: number) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return this.prisma.merchant.delete({
      where: { id },
    });
  }
}