import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/createCategoryDto';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    async create(createCategoryDto: CreateCategoryDto) {
        const existingCategory = await this.prisma.category.findUnique({
            where: { name: createCategoryDto.name },
        });

        if (existingCategory) {
            throw new BadRequestException(`Category with name "${createCategoryDto.name}" already exists.`);
        }

        return this.prisma.category.create({
            data: createCategoryDto,
        });
    }

    async findAll() {
        return await this.prisma.category.findMany();
    }

    async findOne(id: number) {
        return this.prisma.category.findUnique({ where: { id } });
    }

    async update(id: number, data: UpdateCategoryDto) {
        return this.prisma.category.update({ where: { id }, data});
    }

    async remove(id: number) {
        return this.prisma.category.delete({ where: { id } });
    }

}
