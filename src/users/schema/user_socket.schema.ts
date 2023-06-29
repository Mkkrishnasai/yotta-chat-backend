import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId } from "mongoose";

export type UserSocketDocument = UserSocket & Document;

@Schema()
export class UserSocket {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    userId: ObjectId

    @Prop({required : true})
    socket_id: string;

    @Prop({type: Date, default: Date.now })
    created_at: Date;
}

export const UserSocketSchema = SchemaFactory.createForClass(UserSocket);
UserSocketSchema.index({ userId: 1 },{
    unique : true
});
