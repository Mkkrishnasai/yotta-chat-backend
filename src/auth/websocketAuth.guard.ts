import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class WebSocketAuthGuard extends AuthGuard('jwt') implements CanActivate {
  
  constructor(private readonly jwtServ: JwtService){
    super();
  }

  canActivate(context: any) {
    const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
    try {
        const decoded = this.jwtServ.verify(bearerToken);
        return decoded;
    } catch (ex) {
        console.log(ex);
        return false;
    }
  }
}
