// user/dto/create-user.dto.ts

import { IsEmail, IsString } from 'class-validator';
import { User } from '../user.entity';

export class CreateUserDto extends User {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
