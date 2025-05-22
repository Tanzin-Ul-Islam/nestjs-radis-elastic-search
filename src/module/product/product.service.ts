import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';
import { ApiResponse, ResponseUtils } from 'src/utils/response.utils';
import { Product } from './schemas/product.schema';
import { Types } from 'mongoose';
import { RedisService } from 'src/services/redis/redis.service';
import { CACHE_KEYS } from 'src/constants/cache-keys';
import { FilterProductDto, SortOrder } from './dto/filter-product.dto';
import { productFilterResultInterface } from 'src/interface/result.interface';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly redisService: RedisService,
  ) {}
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
      const newProduct = await this.productRepository.create(createProductDto);
      await this.redisService.del(CACHE_KEYS.PRODUCT.ALL);
      return ResponseUtils.handleSuccess<Product>(newProduct);
    } catch (error) {
      return ResponseUtils.handleGenericError<Product>(
        error,
        'creating product',
      );
    }
  }

  async findAll(
    filter: FilterProductDto,
  ): Promise<ApiResponse<productFilterResultInterface>> {
    try {
      const {
        searchKey,
        color,
        category,
        brand,
        minPrice,
        maxPrice,
        sortBy = 'createdAt',
        sortOrder = SortOrder.DESC,
        page = 1,
        limit = 10,
      } = filter;

      const filterQuery: Record<string, any> = {};
      if (searchKey) filterQuery.name = { $regex: searchKey, $options: 'i' };
      if (category) filterQuery.category = new Types.ObjectId(category);
      if (brand) filterQuery.brand = new Types.ObjectId(brand);
      if (color) filterQuery.color = new Types.ObjectId(color);
      if (minPrice !== undefined || maxPrice !== undefined) {
        filterQuery.price = {};
        if (minPrice !== undefined) filterQuery.price.$gte = minPrice;
        if (maxPrice !== undefined) filterQuery.price.$lte = maxPrice;
      }
      const sort: Record<string, 1 | -1> = {
        [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1,
      };

      const res = await this.productRepository.findWithPagination({
        filterQuery,
        page,
        limit,
        sort,
      });
      console.log('res', res);
      return ResponseUtils.handleSuccess<productFilterResultInterface>(res);
    } catch (error) {
      return ResponseUtils.handleGenericError<productFilterResultInterface>(
        error,
        'fetching product',
      );
    }
  }

  async findOne(id: string): Promise<ApiResponse<Product>> {
    try {
      const product = await this.productRepository.findProductByAttributes(id);
      if (!product) {
        return ResponseUtils.handleNotFound<Product>('Product not found.');
      }
      return ResponseUtils.handleSuccess<Product>(product);
    } catch (error) {
      return ResponseUtils.handleGenericError<Product>(
        error,
        'fetching product',
      );
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ApiResponse<Product>> {
    try {
      const updateData = updateProductDto;

      const result = await this.productRepository.findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        updateData,
      );
      if (!result)
        return ResponseUtils.handleNotFound<Product>('Product not found.');
      await this.redisService.del(CACHE_KEYS.PRODUCT.ONE(id));
      return ResponseUtils.handleSuccess<Product>(
        result,
        'Product updated successfully.',
      );
    } catch (error) {
      return ResponseUtils.handleGenericError<Product>(
        error,
        'updating product',
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
      await this.redisService.del(CACHE_KEYS.PRODUCT.ONE(id));
      return ResponseUtils.handleSuccess<boolean>(
        true,
        'Product deleted successfully.',
      );
    } catch (error) {
      return ResponseUtils.handleGenericError<boolean>(
        error,
        'deleting product',
      );
    }
  }
}
