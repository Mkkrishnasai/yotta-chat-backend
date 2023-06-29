import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import mongoose, { Model } from 'mongoose';
import { MongoError, ObjectId } from 'mongodb';
import { classToPlain, plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { UserChat, UserChatDocument } from './schema/user_chats.schema';
import { UserSocket, UserSocketDocument } from './schema/user_socket.schema';
import { CreateSocketDto } from './dto/create-socket.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private users: Model<UserDocument>,
    @InjectModel(UserChat.name) private chats: Model<UserChatDocument>,
    @InjectModel(UserSocket.name) private sockets: Model<UserSocketDocument>
    ){}

  async findOne(username){
    return await this.users.findOne({username});
  }

  async findById(userId){
    return await this.users.findById(userId);
  }

  async create(userDto: CreateUserDto) {
    try{
      let userPlain = classToPlain(userDto);
      userPlain.password = await bcrypt.hash(userPlain.password,10)
      userDto = plainToClass(CreateUserDto,userPlain);
      let user =  await this.users.create(userDto);
      return {
        status : true,
        message : "Created successfully",
        user : user
      }
    }catch(e){
      console.log(e);
      let err = {
        status : false,
        message : "Failed to create user"
      }
      if (e instanceof MongoError && e.code === 11000) {
        err.message = "Username Already taken"
      }
      return err;
    }
  }

  async saveMessage(data){
    try {
      let m = await this.chats.create(data);
      return {
        status : true,
        message : "saved successfully",
        chat : m
      }
    } catch (error) {
      return {
        status : false,
        message : error.message
      }
    }
  }

  async getMessages(filter){
    try {
      let chats = await this.chats.find({
        $or: [
          { from: filter.from, to: filter.to },
          { from: filter.to, to: filter.from },
        ],
      }).exec();
      return {
        status : true,
        message : "data fetched successfully",
        chats : chats
      }
    } catch (error) {
      return {
        status : false,
        message : error.message,
        chats : []
      }
    }
  }

  async getOnlineUsers(){
    const pipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          'user.password': 0,
          'user.__v' : 0
        },
      },
    ];
    const result = await this.sockets.aggregate(pipeline).exec();
    return {
      status : true,
      message: "successfull",
      users : result.map((item) => item.user)
    };
  }

  async getUserDetails(id){
    let user = await this.users.findById(id);
    return {
      status : true,
      message: "successfull",
      users : user
    };
  }

  async saveSocketUser(socket: CreateSocketDto){
    return await this.sockets.create(socket);
  }

  async getSocketUser(socket_id){
    return await this.sockets.findOne({socket_id});
  }

  async getSocketUserByUser(userId){
    return await this.sockets.find({userId});
  }

  async deleteSocketUser(socket_id){
    return await this.sockets.deleteOne({socket_id});
  }

  async deleteSocketUserByUser(userId){
    return await this.sockets.deleteOne({userId});
  }

  async editChat(user,chat_id,message){
    try {
      let chat = await this.chats.findOneAndUpdate({ from : user._id, _id : chat_id},{
        $set : {
          message : message
        }
      });
      return {
        status : true,
        message : 'updated message',
        chat : chat
      }; 
    } catch (error) {
      console.log(error);
      return {
        status : false,
        message : 'failed to update message'
      };
    }
  }

  async deleteChat(user,chat_id){
    try {
      await this.chats.findOneAndDelete({ from : user._id, _id : chat_id});
      return {
        status : true,
        message : 'message deleted'
      }      
    } catch (error) {
      console.log(error);
      return {
        status : false,
        message : error.message
      }
    }
  }
}
