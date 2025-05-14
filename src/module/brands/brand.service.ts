import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandRepository } from './brand.repository';
import { Brand } from './schemas/brand.schema';
import { ApiResponse, ResponseUtils } from 'src/utils/response.utils';
import { Types } from 'mongoose';
@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) { }
  async create(createBrandDto: CreateBrandDto): Promise<ApiResponse<Brand>> {
    try {
      const brand = await this.brandRepository.findOne({
        name: createBrandDto.name,
      });
      if (brand) {
        return ResponseUtils.handleConflict<Brand>();
      }
      const newBrand = await this.brandRepository.create(createBrandDto);
      return ResponseUtils.handleSuccess<Brand>(newBrand);
    } catch (error) {
      return ResponseUtils.handleError<Brand>(
        error,
        'An error occurred while creating brand'
      );
    }
  }

  async findAll(): Promise<ApiResponse<Brand[]>> {
    try {
      const allCategory = await this.brandRepository.find({});
      return ResponseUtils.handleSuccess<Brand[]>(allCategory);
    } catch (error) {
      return ResponseUtils.handleError<Brand[]>(
        error,
        'An error occurred while fetching brand'
      );
    }
  }

  async findOne(id: string): Promise<ApiResponse<Brand>> {
    try {
      const category = await this.brandRepository.findById(id);
      if (!category) {
        return ResponseUtils.handleNotFound<Brand>('Category not found.');
      }
      return ResponseUtils.handleSuccess<Brand>(category);
    } catch (error) {
      return ResponseUtils.handleError<Brand>(
        error,
        'An error occurred while fetching brand.'
      );
    }
  }

  async update(
    id: string,
    updateBrandDto: UpdateBrandDto
  ): Promise<ApiResponse<Brand>> {
    try {
      const updateData = updateBrandDto;

      const result = await this.brandRepository.findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        updateData
      );
      if (!result)
        return ResponseUtils.handleNotFound<Brand>('Brand not found.');

      return ResponseUtils.handleSuccess<Brand>(
        result,
        'Brand updated successfully.'
      );
    } catch (error) {
      return ResponseUtils.handleError<Brand>(
        error,
        'An error occurred while updating brand.'
      );
    }
  }

  async remove(id: string): Promise<ApiResponse<boolean>> {
    try {
      const deleted = await this.brandRepository.deleteOne({
        _id: new Types.ObjectId(id),
      });

      if (!deleted)
        return ResponseUtils.handleNotFound<boolean>('Brand not found.');
      return ResponseUtils.handleSuccess<boolean>(
        true,
        'Brand deleted successfully.'
      );
    } catch (error) {
      return ResponseUtils.handleError<boolean>(
        error,
        'An error occurred while deleting brand.'
      );
    }
  }
}
