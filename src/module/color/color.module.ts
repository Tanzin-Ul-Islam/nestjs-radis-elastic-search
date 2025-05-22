import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';
import { ColorRepository } from './color.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Color, ColorSchema } from './schemas/color.schema';
import { RedisModule } from 'src/services/redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Color.name,
        schema: ColorSchema
      }
    ]),
    RedisModule,
  ],
  controllers: [ColorController],
  providers: [ColorService, ColorRepository],
})
export class ColorModule { }
