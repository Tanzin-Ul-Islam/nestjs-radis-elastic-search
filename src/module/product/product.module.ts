import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductRepository } from './product.repository';
import { RedisModule } from 'src/services/redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    RedisModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule { }
