import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';
import { ApiResponse, ResponseUtils } from 'src/utils/response.utils';
import { Product } from './schemas/product.schema';
import { Types } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) { }
  async create(
    createProductDto: CreateProductDto,
  ): Promise<ApiResponse<Product>> {
    try {
      const product = await this.productRepository.findOne({
        name: createProductDto.name,
      });
      if (product) {
        return ResponseUtils.handleConflict<Product>('Product already exists.');
      }
      const newCategory = await this.productRepository.create(createProductDto);
      return ResponseUtils.handleSuccess<Product>(newCategory);
    } catch (error) {
      return ResponseUtils.handleError<Product>(
        error,
        'An error occurred while creating product.'
      );
    }
  }

  async findAll(): Promise<ApiResponse<Product[]>> {
    try {
      const allCategory = await this.productRepository.find({});
      return ResponseUtils.handleSuccess<Product[]>(allCategory);
    } catch (error) {
      return ResponseUtils.handleError<Product[]>(
        error,
        'An error occurred while fetching product.'
      );
    }
  }

  async findOne(id: string): Promise<ApiResponse<Product>> {
    try {
      const category = await this.productRepository.findById(id);
      if (!category) {
        return ResponseUtils.handleNotFound<Product>('Product not found.');
      }
      return ResponseUtils.handleSuccess<Product>(category);
    } catch (error) {
      return ResponseUtils.handleError<Product>(
        error,
        'An error occurred while fetching product.'
      );
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto
  ): Promise<ApiResponse<Product>> {
    try {
      const updateData = updateProductDto;

      const result = await this.productRepository.findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        updateData
      );
      if (!result)
        return ResponseUtils.handleNotFound<Product>('Product not found.');

      return ResponseUtils.handleSuccess<Product>(
        result,
        'Product updated successfully.'
      );
    } catch (error) {
      return ResponseUtils.handleError<Product>(
        error,
        'An error occurred while updating product.'
      );
    }
  }

  async remove(id: string): Promise<ApiResponse<boolean>> {
    try {
      const deleted = await this.productRepository.deleteOne({
        _id: new Types.ObjectId(id),
      });

      if (!deleted)
        return ResponseUtils.handleNotFound<boolean>('Product not found.');
      return ResponseUtils.handleSuccess<boolean>(
        true,
        'Product deleted successfully.'
      );
    } catch (error) {
      return ResponseUtils.handleError<boolean>(
        error,
        'An error occurred while deleting product.'
      );
    }
  }
}
