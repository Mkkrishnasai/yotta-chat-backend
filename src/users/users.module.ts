import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UserSocket, UserSocketSchema } from './schema/user_socket.schema';
import { UserChat, UserChatSchema } from './schema/user_chats.schema';

@Module({
  imports :[MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: UserSocket.name, schema: UserSocketSchema },
    { name: UserChat.name, schema: UserChatSchema },
  ])],
  controllers: [UsersController],
  providers: [UsersService],
  exports : [UsersService]
})
export class UsersModule {}
