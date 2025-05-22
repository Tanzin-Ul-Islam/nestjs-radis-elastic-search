import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandRepository } from './brand.repository';
import { Brand } from './schemas/brand.schema';
import { ApiResponse, ResponseUtils } from 'src/utils/response.utils';
import { Types } from 'mongoose';
import { RedisService } from 'src/services/redis/redis.service';
import { CACHE_KEYS } from 'src/constants/cache-keys';
import { resuletInterface } from 'src/interface/result.interface';
@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly redisService: RedisService,
  ) {}
  async create(createBrandDto: CreateBrandDto): Promise<ApiResponse<Brand>> {
    try {
      const brand = await this.brandRepository.findOne({
        name: createBrandDto.name,
      });
      if (brand) {
        return ResponseUtils.handleConflict<Brand>();
      }
      const newBrand = (await this.brandRepository.create(
        createBrandDto,
      )) as resuletInterface;
      await this.clearAndCacheSingleEntity(newBrand._id.toString(), newBrand);
      return ResponseUtils.handleSuccess<Brand>(newBrand);
    } catch (error) {
      return ResponseUtils.handleGenericError(error, 'creating brand');
    }
  }

  async findAll(): Promise<ApiResponse<Brand[]>> {
    try {
      const cachedBrand = await this.redisService.get<Brand>(
        CACHE_KEYS.BRAND.ALL,
      );
      if (cachedBrand) {
        return ResponseUtils.handleSuccess<Brand[]>(
          cachedBrand,
          'Brands fetched from cache.',
        );
      }
      const allCategory = await this.brandRepository.find({});
      await this.redisService.set(CACHE_KEYS.BRAND.ALL, allCategory);
      return ResponseUtils.handleSuccess<Brand[]>(allCategory);
    } catch (error) {
      return ResponseUtils.handleGenericError(error, 'fetching brands');
    }
  }

  async findOne(id: string): Promise<ApiResponse<Brand>> {
    try {
      const cachedBrand = await this.redisService.get<Brand>(
        CACHE_KEYS.BRAND.ONE(id),
      );
      if (cachedBrand) {
        return ResponseUtils.handleSuccess<Brand>(
          cachedBrand,
          'Brand fetched from cache.',
        );
      }
      const category = await this.brandRepository.findById(id);
      if (!category) {
        return ResponseUtils.handleNotFound<Brand>('Category not found.');
      }
      await this.redisService.set(CACHE_KEYS.BRAND.ONE(id), category);
      return ResponseUtils.handleSuccess<Brand>(category);
    } catch (error) {
      return ResponseUtils.handleGenericError(error, 'fetching brand');
    }
  }

  async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<ApiResponse<Brand>> {
    try {
      const updateData = updateBrandDto;

      const result = await this.brandRepository.findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        updateData,
      );
      if (!result)
        return ResponseUtils.handleNotFound<Brand>('Brand not found.');
      await this.clearAndCacheSingleEntity(id, result);
      return ResponseUtils.handleSuccess<Brand>(
        result,
        'Brand updated successfully.',
      );
    } catch (error) {
      return ResponseUtils.handleGenericError(error, 'updating brands');
    }
  }

  async remove(id: string): Promise<ApiResponse<boolean>> {
    try {
      const brand = await this.brandRepository.findById(id);
      if (!brand)
        return ResponseUtils.handleNotFound<boolean>('Brand not found.');

      const deleted = await this.brandRepository.deleteOne({
        _id: new Types.ObjectId(id),
      });

      if (!deleted)
        return ResponseUtils.handleNotFound<boolean>('Brand not found.');
      await this.redisService.del(CACHE_KEYS.BRAND.ALL);
      await this.redisService.del(CACHE_KEYS.BRAND.ONE(id));
      return ResponseUtils.handleSuccess<boolean>(
        true,
        'Brand deleted successfully.',
      );
    } catch (error) {
      return ResponseUtils.handleGenericError(error, 'deleting brands');
    }
  }

  private async clearAndCacheSingleEntity(
    id: string,
    data: unknown,
  ): Promise<void> {
    await this.redisService.del(CACHE_KEYS.BRAND.ALL);
    await this.redisService.set(CACHE_KEYS.BRAND.ONE(id), data);
  }
}
