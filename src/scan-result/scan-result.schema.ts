// scan-result.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
})
export class ScanResult {
  @Prop({ required: true, default: "No text extracted" })
  extractedText: string;

  @Prop({ type: Object, required: true, default: {} })
  detectedComposition: Record<string, number>;

  @Prop({ required: true, default: false })
  isExact: boolean;

  @Prop({ required: true, default: 0 })
  processingTimeMs: number;

  @Prop()
  imagePath?: string;

  @Prop({ required: true })
  userId: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface ScanResultDocument extends ScanResult, Document {
  createdAt: Date;
  updatedAt: Date;
}

export const ScanResultSchema = SchemaFactory.createForClass(ScanResult);