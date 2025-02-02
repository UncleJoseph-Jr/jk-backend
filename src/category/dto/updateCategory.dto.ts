import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './createCategoryDto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}