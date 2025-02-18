import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMediaDto {
    @IsString()
    @IsNotEmpty()
    filename: String

    @IsString()
    @IsNotEmpty()
    type: String

    @IsString()
    @IsNotEmpty()
    file_url: String

    @IsNumber()
    @IsNotEmpty()
    size: Number

}
