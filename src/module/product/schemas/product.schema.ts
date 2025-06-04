import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from 'src/common/schema/abstract.schema';
@Schema({
  timestamps: true,
})
export class Product extends AbstractDocument {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true })
  brand: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Color',
    required: false,
    default: null,
  })
  color: Types.ObjectId;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
