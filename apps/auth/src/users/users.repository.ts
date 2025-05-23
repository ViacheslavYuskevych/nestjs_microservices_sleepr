import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository, UserDocument } from '@app/common';

@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument> {
  protected logger = new Logger(UsersRepository.name);

  constructor(
    @InjectModel(UserDocument.name)
    model: Model<UserDocument>,
  ) {
    super(model);
  }
}
