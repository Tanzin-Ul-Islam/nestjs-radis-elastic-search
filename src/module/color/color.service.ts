import { Injectable } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ColorRepository } from './color.repository';
import { Color } from './schemas/color.schema';
import { ApiResponse, ResponseUtils } from 'src/utils/response.utils';
import { Types } from 'mongoose';
@Injectable()
export class ColorService {
  constructor(private readonly colorRepository: ColorRepository) { }
  async create(createColorDto: CreateColorDto): Promise<ApiResponse<Color>> {
    try {
      const color = await this.colorRepository.findOne({
        name: createColorDto.name,
      });
      if (color) {
        return ResponseUtils.handleConflict<Color>();
      }
      const newColor = await this.colorRepository.create(createColorDto);
      return ResponseUtils.handleSuccess<Color>(newColor);
    } catch (error) {
      return ResponseUtils.handleError<Color>(
        error,
        'An error occurred while creating color.'
      );
    }
  }

  async findAll(): Promise<ApiResponse<Color[]>> {
    try {
      const allColor = await this.colorRepository.find({});
      return ResponseUtils.handleSuccess<Color[]>(allColor);
    } catch (error) {
      return ResponseUtils.handleError<Color[]>(
        error,
        'An error occurred while fetching color.'
      );
    }
  }

  async findOne(id: string): Promise<ApiResponse<Color>> {
    try {
      const color = await this.colorRepository.findById(id);
      if (!color) {
        return ResponseUtils.handleNotFound<Color>('Category not found');
      }
      return ResponseUtils.handleSuccess<Color>(color);
    } catch (error) {
      return ResponseUtils.handleError<Color>(
        error,
        'An error occurred while fetching color.'
      );
    }
  }

  async update(
    id: string,
    updateColorDto: UpdateColorDto
  ): Promise<ApiResponse<Color>> {
    try {
      const updateData = updateColorDto;

      const result = await this.colorRepository.findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        updateData
      );
      if (!result)
        return ResponseUtils.handleNotFound<Color>('Color not found.');

      return ResponseUtils.handleSuccess<Color>(
        result,
        'Color updated successfully.'
      );
    } catch (error) {
      return ResponseUtils.handleError<Color>(
        error,
        'An error occurred while updating color.'
      );
    }
  }

  async remove(id: string): Promise<ApiResponse<boolean>> {
    try {
      const deleted = await this.colorRepository.deleteOne({
        _id: new Types.ObjectId(id),
      });

      if (!deleted)
        return ResponseUtils.handleNotFound<boolean>('Color not found.');
      return ResponseUtils.handleSuccess<boolean>(
        true,
        'Color deleted successfully.'
      );
    } catch (error) {
      return ResponseUtils.handleError<boolean>(
        error,
        'An error occurred while deleting color.'
      );
    }
  }
}
