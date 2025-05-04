// src/events/schemas/event.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type EventDocument = Event & Document;

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
}

export enum Visibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  INVITE_ONLY = 'invite_only',
}

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  image: string;

//   @Prop([String])
//   gallery?: string[];

//   @Prop()
//   address?: string;

//   @Prop()
//   venueName?: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  

  

  @Prop({ default: 0 })
  maxParticipants?: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  participants: string[];	

  

  @Prop()
  registrationDeadline?: Date;

  

//   @Prop({ enum: EventStatus, default: EventStatus.DRAFT })
//   status: EventStatus;

  @Prop({ enum: Visibility, default: Visibility.PUBLIC })
  visibility: Visibility;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop()
  pointsAwarded?: number;

  @Prop({ default: false })
  certificateAvailable?: boolean;

  @Prop([String])
  badges?: string[];

  @Prop()
  chatRoomId?: string;

  @Prop()
  organizerContact?: string;

  @Prop({ type: Object })
  customFields?: Record<string, any>;
}

export const eventSchema = SchemaFactory.createForClass(Event);