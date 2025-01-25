import { Controller, Put, Param, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Role, Status, MerchantStatus } from '@prisma/client';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiQuery,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Update user role' })
  @ApiBody({
    description: 'User role',
    schema: {
      properties: {
        role: { type: 'string', example: 'ADMIN' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User role updated successfully',
    schema: {
      example: {
        message: 'User role updated successfully',
        user: {
          id: 1,
          name: 'User1',
          email: 'user1@mail.com',
          password: '$2a$10$gNgP1mpc1f9iUAYZi2tuYuUoB...',
          resetPasswordToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczNzY...',
          resetTokenExpiresAt: '2025-01-23T19:13:11.610Z',
          phoneNumber: '0987654321',
          role: 'ADMIN',
          isActive: 'true',
          status: 'ACTIVE',
          verificationToken: 'null',
          createdAt: '2025-01-23T18:09:45.552Z',
          updatedAt: '2025-01-25T05:10:06.198Z',
          lastLogin: '2025-01-23T18:09:45.552Z',
        },
      },
    },
  })
  @Put('user/:id/role')
  async updateUserRole(
    @Param('id') userId: number,
    @Body('role') role: string,
  ) {
    const enumRole = Role[role as keyof typeof Role];
    if (!enumRole) {
      throw new Error(`Invalid role ${role}`);
    }
    return this.adminService.updateUserRole(userId, enumRole);
  }

  /////////////////////////////////////////////////////////////////

  @Put('user/:id/status')
  async updateUserStatus(
    @Param('id') userId: number,
    @Body('status') status: string,
  ) {
    const enumStatus = Status[status as keyof typeof Status];
    if (!enumStatus) {
      throw new Error(`Invalid status: ${status}`);
    }
    return this.adminService.updateUserStatus(userId, enumStatus);
  }

  /////////////////////////////////////////////////////////////////

  @Put('merchant/:id/status')
  async updateMerchantStatus(
    @Param('id') merchantId: number,
    @Body('status') status: string,
  ) {
    const enumMerchantStatus =
      MerchantStatus[status as keyof typeof MerchantStatus];
    if (!enumMerchantStatus) {
      throw new Error(`Invalid merchant status: ${status}`);
    }
    return this.adminService.updateMerchantStatus(
      merchantId,
      enumMerchantStatus,
    );
  }
  /////////////////////////////////////////////////////////////////
}
