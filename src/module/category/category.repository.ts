import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repository/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { Category } from './schemas/category.schema';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  protected readonly logger = new Logger(Category.name);
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {
    super(categoryModel);
  }

}