import { DefaultValuePipe } from "@nestjs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Date, ObjectId } from "mongoose";

export type UserChatDocument = UserChat & Document;

@Schema()
export class UserChat {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    from: ObjectId
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    to: ObjectId

    @Prop({required: true})
    message: string;

    @Prop({ type : Date,default: Date.now })
    created_at: Date;
}

export const UserChatSchema = SchemaFactory.createForClass(UserChat);
UserChatSchema.index({ userId: 1 });
