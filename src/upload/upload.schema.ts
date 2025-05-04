// upload.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UploadDocument = Upload & Document;

@Schema({ timestamps: true })
export class Upload {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  filePath: string;

  @Prop({ type: Object, required: true })
  analysisResult: {
    fabric: string;
    carbonFootprint: number;
    timestamp: string;
  };

  @Prop()
  outfitType: string;

  @Prop({ default: 0 })
  ecoScore: number; // New field to track improvement score

  // These are automatically added by timestamps: true
  createdAt: Date;
  updatedAt: Date;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);