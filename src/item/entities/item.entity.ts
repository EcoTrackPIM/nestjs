import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema()
export class Item {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ default: 1 })
  amount: number;

  @Prop()
  tips: string;

  @Prop({ default: true })
  recyclable: boolean;

  @Prop()
  location: string;

  @Prop({ default: 0 }) // ✅ Added carbonFootprint field
  carbonFootprint: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);