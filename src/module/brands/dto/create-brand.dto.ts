import { IsEmpty, IsNotEmpty, IsOptional } from "class-validator";

export class CreateBrandDto {
    @IsNotEmpty()
    name: string;
}
