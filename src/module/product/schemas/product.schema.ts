import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractDocument } from "src/common/schema/abstract.schema";
@Schema({
  timestamps: true,
})

export class Product extends AbstractDocument {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: string;

  @Prop({ type: Types.ObjectId, ref: 'Brands', required: true })
  brand: string;

  @Prop({ type: Types.ObjectId, ref: 'color', required: true })
  color: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

}
export const ProductSchema = SchemaFactory.createForClass(Product);