import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('')
  async register(@Req() req, @Body() userDto: CreateUserDto){
    return await this.usersService.create(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('active')
  async getUsers(@Req() Req){
    return await this.usersService.getOnlineUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Post('chat')
  async saveChat(@Req() req, @Body() body){
    body.from = req.user._id;
    return await this.usersService.saveMessage(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('updateChat/:id')
  async updateChat(@Req() req, @Param('id') id, @Body() body){
    return await this.usersService.editChat(req.user,id,body.message);
  }

  @UseGuards(JwtAuthGuard)
  @Post('deleteChat/:id')
  async deleteChat(@Req() req,@Param('id') id){
    return await this.usersService.deleteChat(req.user,id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('chat')
  async getChat(@Req() req, @Query() filter){
    filter.from = req.user._id;
    console.log(filter);
    
    return await this.usersService.getMessages(filter);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserDetails(@Req() req, @Param('id') id){
    return await this.usersService.getUserDetails(id);
  }

}
