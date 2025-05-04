
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop() code: string;
  @Prop() productName: string;
  @Prop() brands: string;
  @Prop() categories: string;
  @Prop() imageUrl: string;
  @Prop() carbonImpact: number;
  @Prop() ingredients: string;
  @Prop() recyclability: string;
  @Prop() countries: string;
  @Prop() source: string;

}

export const ProductSchema = SchemaFactory.createForClass(Product);