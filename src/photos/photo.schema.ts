import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PhotoDocument = Photo & Document;

@Schema({ timestamps: true })
export class Photo {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  path: string;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
