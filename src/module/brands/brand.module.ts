import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { BrandRepository } from './brand.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandSchema, Brand } from './schemas/brand.schema';
import { RedisModule } from 'src/services/redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Brand.name,
        schema: BrandSchema,
      },
    ]),
    RedisModule,
  ],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
})
export class BrandModule {}
