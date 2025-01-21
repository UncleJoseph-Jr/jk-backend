import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  async createRole(@Body('name') name: string) {
    return this.rolesService.createRole(name);
  }

  @Get()
  async getAllRole() {
    return this.rolesService.getAllRoles();
  }

  @Put(':id')
  async updateRole(@Param('id') id: string, @Body('name') name: string) {
    return this.rolesService.updateRole(parseInt(id), name); // แปลง id เป็นตัวเลข
  }

  @Delete(':id')
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.deleteRole(id);
  }
}
