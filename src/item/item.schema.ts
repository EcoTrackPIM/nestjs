import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema({ timestamps: { createdAt: 'dateAdded', updatedAt: false } })
export class Item {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string; // ⭐ added category

  @Prop({ type: Number, default: 0 })
  carbonFootprint: number;

  @Prop({ type: Number, default: 1 })
  amount: number;

  @Prop()
  tips: string; // ⭐ added tips

  @Prop({ default: true })
  recyclable: boolean; // ⭐ added recyclable

  @Prop()
  location: string;

  @Prop()
  dateAdded: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Item);