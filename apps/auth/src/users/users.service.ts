import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  findOne(_id: string) {
    return this.repository.findOne({ _id });
  }

  async create({ password, ...dto }: CreateUserDto) {
    return this.repository.create({
      ...dto,
      password: await bcrypt.hash(password, 10),
    });
  }

  async verify(email: string, password: string) {
    const user = await this.repository.findOne({ email });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    return user;
  }

  findAll() {
    return this.repository.find({});
  }
}
