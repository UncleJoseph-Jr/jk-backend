import { Injectable, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) {}

    async createRole(name: string) {
        return this.prisma.role.create({ data: { name }});
    }

    async getAllRoles() {
        return this.prisma.role.findMany();
    }

    async updateRole(id: number, name: string) {
        return this.prisma.role.update({ 
            where: {
                id: id,
            }, 
            data: {
                name: name,
            } });
    }

    async deleteRole(id: number) {
        await this.prisma.role.delete({ where: { id } });
        return { message: `Role with ID ${id} has been successfully deleted.` };
    }
}
