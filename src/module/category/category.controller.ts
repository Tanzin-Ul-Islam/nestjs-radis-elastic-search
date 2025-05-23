import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schemas/category.schema';
import { ApiResponse } from 'src/utils/response.utils';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ApiResponse<Category>> {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll(): Promise<ApiResponse<Category[]>> {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Category>> {
    return await this.categoryService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ApiResponse<Category>> {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<boolean>> {
    return await this.categoryService.remove(id);
  }
}
