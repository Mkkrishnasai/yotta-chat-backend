import { IsDate, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { Match } from "src/decorator/match.decorator";

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    username: string


    @IsNotEmpty()
    @IsString()
    full_name: string

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Matches(/.{8,}/)
    password: string;

    @IsString()
    @Match('password', { message: 'Passwords do not match' })
    confirmPassword: string;
}
