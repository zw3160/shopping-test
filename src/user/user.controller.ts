import { Controller, Post, Body, Get, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    return this.userService.register(username, password);
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    if (!username || !password) {
      throw new BadRequestException('Missing required parameters: username and password');
    }
    return this.userService.login(username, password);
  }

  @Get()
  async get(){
    return this.userService.getUsers();
  }
  
}
