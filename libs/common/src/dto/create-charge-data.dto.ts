import {
  IsDefined,
  IsEmail,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateChargeDto } from './create-charge.dto';

export class CreateChargeDataDto {
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateChargeDto)
  charge: CreateChargeDto;
}
