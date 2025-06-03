import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiResponse } from 'src/utils/response.utils';
import { Product } from './schemas/product.schema';
import { FilterProductDto } from './dto/filter-product.dto';
import { productFilterResultInterface } from 'src/interface/result.interface';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ApiResponse<Product>> {
    return await this.productService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Body() filter: FilterProductDto,
  ): Promise<ApiResponse<productFilterResultInterface>> {
    return await this.productService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Product>> {
    return await this.productService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ApiResponse<Product>> {
    return await this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<boolean>> {
    return await this.productService.remove(id);
  }
}
