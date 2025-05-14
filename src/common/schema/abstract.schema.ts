import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AbstractDocument extends Document {
  @Prop({ default: false, index: true, type: Boolean, required: false })
  isDeleted?: boolean;
}
