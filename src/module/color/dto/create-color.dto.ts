import { IsNotEmpty } from "class-validator";

export class CreateColorDto {
    @IsNotEmpty()
    name: string;
}
