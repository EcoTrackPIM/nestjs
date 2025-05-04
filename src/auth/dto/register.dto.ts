import { IsArray, IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class registerdto{
    @IsString()
    @IsNotEmpty()
    name:string
    @IsEmail()
    @IsNotEmpty()
    email:string
    @IsString()
    @IsNotEmpty()
    password:string
    @IsOptional()
    
    roles:string[]
    @IsOptional()
    Profile_pic: string

    @IsOptional()
    Phone_number: string

    @IsOptional()
    Address: string

    @IsOptional()
    Age: number
}