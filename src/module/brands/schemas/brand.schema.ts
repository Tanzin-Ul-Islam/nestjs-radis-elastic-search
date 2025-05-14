import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "src/common/schema/abstract.schema";
@Schema({
    timestamps: true,
})
export class Brand extends AbstractDocument {
    @Prop({ required: true })
    name: string;
}
export const BrandSchema = SchemaFactory.createForClass(Brand)