import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { MerchantStatus } from '@prisma/client';

@ApiTags('Merchant')
@Controller('merchant')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new merchant' })
  @ApiBody({
    description: 'Merchant details',
    schema: {
      properties: {
        name: { type: 'string', example: 'Merchant1' },
        category: { type: 'string', example: 'Food' },
        ownerId: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Merchant created successfully.',
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createMerchant(
    @Body('name') name: string,
    @Body('category') category: string,
    @Body('ownerId') ownerId: number,
  ) {
    return this.merchantService.createMerchant(name, category, ownerId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all merchants' })
  @ApiResponse({
    status: 200,
    description: 'Merchants retrieved successfully.',
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllMerchants() {
    return this.merchantService.getAllMerchants();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get merchant by ID' })
  @ApiResponse({
    status: 200,
    description: 'Merchant retrieved successfully.',
  })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getMerchantById(@Param('id') id: number) {
    return this.merchantService.getMerchantById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update merchant' })
  @ApiBody({
    description: 'Merchant details',
    schema: {
      properties: {
        name: { type: 'string', example: 'Updated Merchant' },
        category: { type: 'string', example: 'Drink' },
        status: { type: 'string', example: 'APPROVED' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Merchant updated successfully.',
  })
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateMerchant(
    @Param('id') id: number,
    @Body() data: { name?: string; category?: string; status?: MerchantStatus },
  ) {
    return this.merchantService.updateMerchant(id, data);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete merchant' })
  @ApiResponse({
    status: 200,
    description: 'Merchant deleted successfully.',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteMerchant(@Param('id') id: number) {
    return this.merchantService.deleteMerchant(id);
  }
}
