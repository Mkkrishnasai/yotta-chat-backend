import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop()
    username: string

    @Prop()
    full_name: string

    @Prop()
    password: string
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ username: 1 },{
    unique : true
});
