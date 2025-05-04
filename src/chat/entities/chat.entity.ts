import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export enum MessageType {
    AUDIO = 'audio',
    CUSTOM = 'custom',
    FILE = 'file',
    IMAGE = 'image',
    SYSTEM = 'system',
    TEXT = 'text',
    UNSUPPORTED = 'unsupported',
    VIDEO = 'video',
  }
  
  export enum Status {
    DELIVERED = 'delivered',
    ERROR = 'error',
    SEEN = 'seen',
    SENDING = 'sending',
    SENT = 'sent',
  }
  

@Schema()
export class Chatmsg{
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;
  @Prop({ required: true, type: Object })
  author;

  @Prop()
  createdAt?: number;

  @Prop({ required: true })
  id: string;

  // @Prop()
  // metadata?: Record<string, any>;

  @Prop()
  remoteId?: string;

  @Prop()
  roomId?: string;

  @Prop()
  showStatus?: boolean;

  @Prop({ enum: Status })
  status?: Status;

  @Prop({ enum: MessageType, required: true })
  type: MessageType;

  @Prop()
  updatedAt?: Date;

  // Conditional fields
  @Prop()
  text?: string; // Only for MessageType.TEXT

  @Prop()
  uri?: string; // Only for MessageType.AUDIO or IMAGE

  @Prop()
  name?: string; // Only for MessageType.AUDIO or IMAGE

  @Prop()
  size?: number; // Only for MessageType.AUDIO or IMAGE

  @Prop()
  duration?: number; // Only for MessageType.AUDIO or IMAGE
}

export const chatmsgShcema=SchemaFactory.createForClass(Chatmsg);