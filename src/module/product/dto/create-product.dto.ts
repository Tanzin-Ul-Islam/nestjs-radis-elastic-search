import { IsEmpty, IsNotEmpty, IsOptional } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    category: string;

    @IsNotEmpty()
    brand: string;

    @IsOptional()
    color: string;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    quantity: number;

}
