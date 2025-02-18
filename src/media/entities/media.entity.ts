import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Media{
    @Prop({required: true})
    filename:string;
    @Prop({required: true})
    type:string;
    @Prop({required: true})
    file_url:string;
    @Prop()
    size: Number;
}

export const mediaShcema=SchemaFactory.createForClass(Media);
