import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class Logindto{
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email:string
    @IsString()
    @IsNotEmpty()
    password:string
}



export class updateUser{
    @IsOptional()
    Profile_pic: string

    @IsOptional()
    Phone_number: string

    @IsOptional()
    Address: string

    @IsOptional()
    Age: number
}

export class LoginDto {
    email: string;
    password: string;
  }