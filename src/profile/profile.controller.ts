import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AuthService } from 'src/auth/auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
@Controller('profile')
export class ProfileController {
  constructor(private authService: AuthService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBody({
    description: 'User profile details',
    schema: {
      properties: {
        token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
    schema: {
      example: {
        id: 1,
        name: 'user1',
        email: 'user1@mail.com',
        role: 'USER',
        status: 'active',
        createdAt: '2025-01-23T12:00:00Z',
        updatedAt: '2025-01-23T12:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
    schema: {
      example: { statusCode: 401, message: 'Unauthorized' },
    },
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    const userId = req.user.userId;
    const user = await this.authService.getUserById(userId);
    return user;
  }
}
