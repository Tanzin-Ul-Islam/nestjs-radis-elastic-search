import { Injectable } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ColorRepository } from './color.repository';
import { Color } from './schemas/color.schema';
import { ApiResponse, ResponseUtils } from 'src/utils/response.utils';
import { Types } from 'mongoose';
import { RedisService } from 'src/services/redis/redis.service';
import { CACHE_KEYS } from 'src/constants/cache-keys';
import { resuletInterface } from 'src/interface/result.interface';
@Injectable()
export class ColorService {
  constructor(
    private readonly colorRepository: ColorRepository,
    private readonly redisService: RedisService,
  ) {}
  async create(createColorDto: CreateColorDto): Promise<ApiResponse<Color>> {
    try {
      const color = await this.colorRepository.findOne({
        name: createColorDto.name,
      });
      if (color) {
        return ResponseUtils.handleConflict<Color>();
      }
      const newColor = (await this.colorRepository.create(
        createColorDto,
      )) as resuletInterface;
      await this.clearAndCacheSingleEntity(newColor._id.toString(), newColor);
      return ResponseUtils.handleSuccess<Color>(newColor);
    } catch (error) {
      return ResponseUtils.handleGenericError(error, 'creating color.');
    }
  }

  async findAll(): Promise<ApiResponse<Color[]>> {
    try {
      const cachedColor = await this.redisService.get<Color[]>(
        CACHE_KEYS.COLOR.ALL,
      );
      if (cachedColor) {
        return ResponseUtils.handleSuccess<Color[]>(
          cachedColor,
          'Color fetched from cache.',
        );
      }
      const allColor = await this.colorRepository.find({});
      await this.redisService.set(CACHE_KEYS.COLOR.ALL, allColor);
      return ResponseUtils.handleSuccess<Color[]>(allColor);
    } catch (error) {
      return ResponseUtils.handleGenericError(error, 'fetching colors');
    }
  }

  async findOne(id: string): Promise<ApiResponse<Color>> {
    try {
      const cachedColor = await this.redisService.get<Color>(
        CACHE_KEYS.COLOR.ONE(id),
      );
      if (cachedColor) {
        return ResponseUtils.handleSuccess<Color>(
          cachedColor,
          'Color fetched from cache.',
        );
      }
      const color = await this.colorRepository.findById(id);
      if (!color) {
        return ResponseUtils.handleNotFound<Color>('Color not found');
      }
      await this.redisService.set(CACHE_KEYS.COLOR.ONE(id), color);
      return ResponseUtils.handleSuccess<Color>(color);
    } catch (error) {
      return ResponseUtils.handleGenericError(error, 'fetching color.');
    }
  }

  async update(
    id: string,
    updateColorDto: UpdateColorDto,
  ): Promise<ApiResponse<Color>> {
    try {
      const updateData = updateColorDto;

      const result = await this.colorRepository.findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        updateData,
      );
      if (!result)
        return ResponseUtils.handleNotFound<Color>('Color not found.');
      await this.clearAndCacheSingleEntity(id, result);
      return ResponseUtils.handleSuccess<Color>(
        result,
        'Color updated successfully.',
      );
    } catch (error) {
      return ResponseUtils.handleGenericError(error, 'updationg color.');
    }
  }

  async remove(id: string): Promise<ApiResponse<boolean>> {
    try {
      const deleted = await this.colorRepository.deleteOne({
        _id: new Types.ObjectId(id),
      });

      if (!deleted)
        return ResponseUtils.handleNotFound<boolean>('Color not found.');
      await this.redisService.del(CACHE_KEYS.COLOR.ALL);
      await this.redisService.del(CACHE_KEYS.COLOR.ONE(id));
      return ResponseUtils.handleSuccess<boolean>(
        true,
        'Color deleted successfully.',
      );
    } catch (error) {
      return ResponseUtils.handleGenericError(error, 'deleting color.');
    }
  }

  private async clearAndCacheSingleEntity(
    id: string,
    data: unknown,
  ): Promise<void> {
    await this.redisService.del(CACHE_KEYS.COLOR.ALL);
    await this.redisService.set(CACHE_KEYS.COLOR.ONE(id), data);
  }
}
