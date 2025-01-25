import { Injectable } from '@nestjs/common';
import { MerchantStatus, Role, Status } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });
  }

  updateUserRole(userId: number, role: Role) {
    return this.prisma.user.update({
      where: { id: Number(userId) },
      data: { role },
    });
  }

  async updateUserStatus(userId: number, status: Status) {
    await this.prisma.user.update({
      where: { id: Number(userId) },
      data: { status },
    });
  }

  async getAllMerchants() {
    return this.prisma.merchant.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        status: true,
      },
    });
  }

  async updateMerchantStatus(merchantId: number, status: MerchantStatus) {
    return this.prisma.merchant.update({
      where: { id: Number(merchantId) },
      data: { status },
    });
  }
}
