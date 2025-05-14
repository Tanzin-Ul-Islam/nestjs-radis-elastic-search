import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "src/common/schema/abstract.schema";
@Schema({
    timestamps: true,
})
export class Color extends AbstractDocument {
    @Prop({ required: true })
    name: string;
}
export const ColorSchema = SchemaFactory.createForClass(Color)