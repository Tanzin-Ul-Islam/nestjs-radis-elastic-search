import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { BaseRepository } from 'src/common/repository/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  protected readonly logger = new Logger(Product.name);
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {
    super(productModel);
  }

}
