import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';
import { ColorRepository } from './color.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Color, ColorSchema } from './schemas/color.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Color.name,
        schema: ColorSchema
      }
    ])
  ],
  controllers: [ColorController],
  providers: [ColorService, ColorRepository],
})
export class ColorModule { }
