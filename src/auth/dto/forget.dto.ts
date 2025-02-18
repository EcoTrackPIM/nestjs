import { IsEmail, IsNotEmpty, IsString } from "class-validator";

// forget.dto.ts
export class ForgetDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
  }
  
  // reset.dto.ts
  export class ResetDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    @IsString()
    code: string;
    @IsNotEmpty()
    @IsString()
    newPassword: string;
  }
  