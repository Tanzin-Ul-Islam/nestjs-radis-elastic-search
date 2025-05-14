import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { BrandRepository } from './brand.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandSchema, Brand } from './schemas/brand.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Brand.name,
        schema: BrandSchema
      }
    ])
  ],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
})
export class BrandModule { }
