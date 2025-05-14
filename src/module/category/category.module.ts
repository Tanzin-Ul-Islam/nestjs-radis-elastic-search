import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { RedisModule } from 'src/services/redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
    RedisModule,
  ],

  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
})
export class CategoryModule { }
