// dto/filter-product.dto.ts
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class FilterProductDto {
  @IsOptional()
  @IsString()
  searchKey?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
