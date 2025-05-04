import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUrl } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  brands: string;

  @IsString()
  @IsNotEmpty()
  categories: string;

  @IsUrl()
  @IsOptional()
  imageUrl: string;

  @IsNumber()
  @IsOptional()
  carbonImpact: number;

  @IsOptional()
  ingredients: any;

  @IsString()
  @IsOptional()
  recyclability: string;

  @IsOptional()
  languages: any;
}
