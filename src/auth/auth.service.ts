import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && await bcrypt.compare(pass,user.password)) {
        return user.toObject();
        }
        return null;
    }

    async checkUser(id){
        return await this.usersService.findById(id);
    }

    async login(user) {
        try{
            let v_user = await this.validateUser(user.username,user.password);
            if(!v_user){
              throw new Error("Failed to login");  
            }
            return {
                status: true,
                username : v_user.username,
                access_token: this.jwtService.sign({_id: v_user._id,username : v_user.username, full_name : v_user.full_name}),
            };
        }catch(e){
            console.log(e);
            return {
                status: false,
                message: e.message
            }
        }
    }
}
