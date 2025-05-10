import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, UserDocument } from '@app/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  async findAll() {
    return this.usersService.findAll();
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getUser(@CurrentUser() user: UserDocument) {
    return user;
  }
}
