import mongoose from "mongoose";
import { Media } from "src/media/entities/media.entity";
export declare class User {
    name: string;
    email: string;
    password: string;
    roles: string[];
    createdAt: Date;
    Profile_pic: Media;
    Phone_number: string;
    Address: string;
    Age: string;
}
export declare const userShcema: mongoose.Schema<User, mongoose.Model<User, any, any, any, mongoose.Document<unknown, any, User> & User & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User, mongoose.Document<unknown, {}, mongoose.FlatRecord<User>> & mongoose.FlatRecord<User> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
