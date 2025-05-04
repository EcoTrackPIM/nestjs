import mongoose from "mongoose";
export declare enum MessageType {
    AUDIO = "audio",
    CUSTOM = "custom",
    FILE = "file",
    IMAGE = "image",
    SYSTEM = "system",
    TEXT = "text",
    UNSUPPORTED = "unsupported",
    VIDEO = "video"
}
export declare enum Status {
    DELIVERED = "delivered",
    ERROR = "error",
    SEEN = "seen",
    SENDING = "sending",
    SENT = "sent"
}
export declare class Chatmsg {
    userId: string;
    author: any;
    createdAt?: number;
    id: string;
    remoteId?: string;
    roomId?: string;
    showStatus?: boolean;
    status?: Status;
    type: MessageType;
    updatedAt?: Date;
    text?: string;
    uri?: string;
    name?: string;
    size?: number;
    duration?: number;
}
export declare const chatmsgShcema: mongoose.Schema<Chatmsg, mongoose.Model<Chatmsg, any, any, any, mongoose.Document<unknown, any, Chatmsg> & Chatmsg & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Chatmsg, mongoose.Document<unknown, {}, mongoose.FlatRecord<Chatmsg>> & mongoose.FlatRecord<Chatmsg> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
