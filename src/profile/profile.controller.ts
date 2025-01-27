import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ProfileService } from './profile.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
    schema: {
      example: {
        id: 1,
        name: 'User1',
        email: 'user1@mail.com',
        phoneNumber: '0987654321',
        role: 'USER',
        status: 'ACTIVE',
        isActive: true,
        createdAt: '2025-01-23T12:00:00Z',
        updatedAt: '2025-01-23T12:00:00Z',
        lastLogin: '2025-01-23T12:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    schema: {
      example: { statusCode: 404, message: 'User not found' },
    },
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    const userId = req.user.userId;
    return this.profileService.getProfile(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({
    description: 'User profile details',
    schema: {
      properties: {
        name: { type: 'string', example: 'Updated Name' },
        phoneNumber: { type: 'string', example: '0987654321' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully.',
    schema: {
      example: {
        id: 1,
        name: 'Updated Name',
        email: 'user1@mail.com',
        phoneNumber: '0987654321',
        role: 'USER',
        status: 'ACTIVE',
        isActive: true,
        createdAt: '2025-01-23T12:00:00Z',
        updatedAt: '2025-01-23T12:00:00Z',
        lastLogin: '2025-01-23T12:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    schema: {
      example: { statusCode: 404, message: 'User not found' },
    },
  })
  @Put()
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req,
    @Body() data: { name?: string; phoneNumber?: string },
  ) {
    const userId = req.user.userId;
    return this.profileService.updateProfile(userId, data);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({
    description: 'Change password details',
    schema: {
      properties: {
        currentPassword: { type: 'string', example: 'oldPassword123' },
        newPassword: { type: 'string', example: 'newPassword123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully.',
    schema: {
      example: { message: 'Password changed successfully' },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    schema: {
      example: { statusCode: 404, message: 'User not found' },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Current password is incorrect.',
    schema: {
      example: { statusCode: 409, message: 'Current password is incorrect' },
    },
  })
  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    const userId = req.user.userId;
    return this.profileService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );
  }
}
