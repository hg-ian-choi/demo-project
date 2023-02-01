// users/dto/create-user.dto.ts

import { IsEmail, IsString } from 'class-validator';
import { User } from '../user.entity';

export class CreateUserDto extends User {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public address: string;
}
