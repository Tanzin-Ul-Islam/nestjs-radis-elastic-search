import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './category.repository';
import { ApiResponse, ResponseUtils } from 'src/utils/response.utils';
import { Category } from './schemas/category.schema';
import { Types } from 'mongoose';
import { RedisService } from 'src/services/redis/redis.service';
import { CACHE_KEYS } from 'src/constants/cache-keys';
import { categoryInterface } from 'src/interface/category.interface';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly redisService: RedisService,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<ApiResponse<Category>> {
    try {
      const category = await this.categoryRepository.findOne({
        name: createCategoryDto.name,
      });
      if (category) {
        return ResponseUtils.handleConflict<Category>(
          'Category already exists.',
        );
      }
      const newCategory = (await this.categoryRepository.create(
        createCategoryDto,
      )) as categoryInterface;
      await this.clearAndCacheSingleCategory(
        newCategory._id.toString(),
        newCategory,
      );
      return ResponseUtils.handleSuccess<Category>(
        newCategory,
        'Category created successfully.',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return this.handleGenericError(error, 'creating');
    }
  }

  async findAll(): Promise<ApiResponse<Category[]>> {
    try {
      const cachedCategory = await this.redisService.get<Category[]>(
        CACHE_KEYS.CATEGORY.ALL,
      );
      if (cachedCategory) {
        return ResponseUtils.handleSuccess<Category[]>(
          cachedCategory,
          'Categories fetched from cache.',
        );
      }
      const categories = await this.categoryRepository.find({});
      await this.redisService.set(CACHE_KEYS.CATEGORY.ALL, categories);
      return ResponseUtils.handleSuccess<Category[]>(categories);
    } catch (error) {
      return this.handleGenericError(error, 'fetching');
    }
  }

  async findOne(id: string): Promise<ApiResponse<Category>> {
    try {
      const cachedCategory = await this.redisService.get<Category>(
        CACHE_KEYS.CATEGORY.ONE(id),
      );
      if (cachedCategory) {
        return ResponseUtils.handleSuccess<Category>(
          cachedCategory,
          'Category fetched from cache.',
        );
      }
      const category = await this.categoryRepository.findById(id);
      if (!category) {
        return ResponseUtils.handleNotFound<Category>('Category not found');
      }
      await this.redisService.set(CACHE_KEYS.CATEGORY.ONE(id), category, 3600);
      return ResponseUtils.handleSuccess<Category>(category);
    } catch (error) {
      return this.handleGenericError(error, 'fetching');
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ApiResponse<Category>> {
    try {
      const updateData = updateCategoryDto;

      const result = await this.categoryRepository.findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        updateData,
      );
      if (!result)
        return ResponseUtils.handleNotFound<Category>('Category not found.');
      await this.redisService.del(CACHE_KEYS.CATEGORY.ONE(id));
      await this.clearAndCacheSingleCategory(id, result);
      return ResponseUtils.handleSuccess<Category>(
        result,
        'Category updated successfully.',
      );
    } catch (error) {
      return this.handleGenericError(error, 'updating');
    }
  }

  async remove(id: string): Promise<ApiResponse<boolean>> {
    try {
      const deleted = await this.categoryRepository.deleteOne({
        _id: new Types.ObjectId(id),
      });

      if (!deleted)
        return ResponseUtils.handleNotFound<boolean>('Category not found.');
      await this.redisService.del(CACHE_KEYS.CATEGORY.ALL);
      await this.redisService.del(CACHE_KEYS.CATEGORY.ONE(id));
      return ResponseUtils.handleSuccess<boolean>(
        true,
        'Category deleted successfully.',
      );
    } catch (error) {
      return this.handleGenericError(error, 'deleting');
    }
  }

  private async clearAndCacheSingleCategory(
    id: string,
    data: unknown,
  ): Promise<void> {
    await this.redisService.del(CACHE_KEYS.CATEGORY.ALL);
    await this.redisService.set(CACHE_KEYS.CATEGORY.ONE(id), data);
  }

  private handleGenericError<T>(error: any, operation: string): ApiResponse<T> {
    return ResponseUtils.handleError<T>(
      error,
      `An error occurred while ${operation} category.`,
    );
  }
}
