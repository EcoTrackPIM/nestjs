import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Media } from "src/media/entities/media.entity";

@Schema()
export class User{
    @Prop({required: true})
    name:string;
    @Prop({required: true, unique: true})
    email:string;
    @Prop({required: true})
    password:string;
    @Prop()
    roles: string[];
    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Media', required: false })
    Profile_pic: Media

    @Prop()
    Phone_number: string

    @Prop()
    Address: string

    @Prop()
    Age: string
}

export const userShcema=SchemaFactory.createForClass(User);
