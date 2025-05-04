import mongoose, { Document } from 'mongoose';
export type EventDocument = Event & Document;
export declare enum EventStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    CANCELLED = "cancelled"
}
export declare enum Visibility {
    PUBLIC = "public",
    PRIVATE = "private",
    INVITE_ONLY = "invite_only"
}
export declare class Event {
    name: string;
    description: string;
    image: string;
    latitude: number;
    longitude: number;
    startTime: Date;
    endTime: Date;
    maxParticipants?: number;
    participants: string[];
    registrationDeadline?: Date;
    visibility: Visibility;
    isFeatured: boolean;
    pointsAwarded?: number;
    certificateAvailable?: boolean;
    badges?: string[];
    chatRoomId?: string;
    organizerContact?: string;
    customFields?: Record<string, any>;
}
export declare const eventSchema: mongoose.Schema<Event, mongoose.Model<Event, any, any, any, mongoose.Document<unknown, any, Event> & Event & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Event, mongoose.Document<unknown, {}, mongoose.FlatRecord<Event>> & mongoose.FlatRecord<Event> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
