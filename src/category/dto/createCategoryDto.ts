import { IsOptional, IsString, Length } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @Length(1, 10)
    name: string;
}

export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    @Length(1, 100)
    name?: string;
}