import { Inject, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketAuthGuard } from 'src/auth/websocketAuth.guard';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({ cors: '*:*' })
export class ChatGateway {

  constructor(@Inject(UsersService)private readonly userService: UsersService,private readonly jwtServ: JwtService){}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  async handleChatMessage(client: Socket, payload: any): Promise<void> {
    let userData: any = await this.jwtServ.decode(client.handshake.headers.authorization);
    if(userData && userData._id){
      let users = await this.userService.getSocketUserByUser(payload.to);
      if(users.length > 0){
          users.forEach(u => {
              this.server.to(u.socket_id).emit('message', {
                  mid: payload.mid,
                  from: userData._id,
                  to: payload.to,
                  message: payload.message
              });
          })
      }
    }
  }

  @SubscribeMessage('edit_message')
  async handleEditChatMessage(client: Socket, payload: any): Promise<void> {
    let userData: any = await this.jwtServ.decode(client.handshake.headers.authorization);
    if(userData && userData._id){
      let users = await this.userService.getSocketUserByUser(payload.to);
      if(users.length > 0){
          users.forEach(u => {
              this.server.to(u.socket_id).emit('edited_message', {
                  mid : payload.mid,
                  from: userData._id,
                  to: payload.to,
                  message: payload.message
              });
          })
      }
    }
  }

  @SubscribeMessage('delete_message')
  async handleDeleteChatMessage(client: Socket, payload: any): Promise<void> {
    let userData: any = await this.jwtServ.decode(client.handshake.headers.authorization);
    if(userData && userData._id){
      let users = await this.userService.getSocketUserByUser(payload.to);
      if(users.length > 0){
          users.forEach(u => {
              this.server.to(u.socket_id).emit('deleted_message', {
                mid : payload.mid
              });
          })
      }
    }
  }

  @SubscribeMessage('login_user')
  async handleUserLogin(client: Socket, payload: any): Promise<void> {
    let userData: any = await this.jwtServ.decode(client.handshake.headers.authorization);
    if(userData && userData._id){
      await this.userService.deleteSocketUserByUser(userData._id);
      await this.userService.saveSocketUser({userId : userData._id, socket_id : client.id});
      let user = await this.userService.findById(userData._id);
      user = user.toObject();
      delete user.password;
      this.server.emit('active_users',user);
    }
  }

  afterInit(server: Server): void {
    console.log("Initialized");
  }

  handleConnection(client: Socket): void {
    
  }

  async handleDisconnect(client: Socket): Promise<void> {
    let userData: any = await this.jwtServ.decode(client.handshake.headers.authorization);    
    await this.userService.deleteSocketUser(client.id);
    this.server.emit('deactive_users',userData._id);
  }
}
