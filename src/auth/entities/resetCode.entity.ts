import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class resetCode extends Document {
  @Prop({ required: true })
  email: string; // L'ID de l'utilisateur auquel le token est associé

  @Prop({ required: true })
  code: string; // Le token d'actualisation

  @Prop({ required: true })
  expiryDate: Date; // La date d'expiration du token
}

export const resetcodeschema = SchemaFactory.createForClass(resetCode);