import { IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateSocketDto {
    @IsNotEmpty()
    @IsString()
    userId: ObjectId

    @IsString()
    @IsNotEmpty()
    socket_id: string
}
