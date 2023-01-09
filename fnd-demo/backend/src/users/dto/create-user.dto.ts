// user/dto/create-user.dto.ts

import { IsEmail, IsString, Matches } from 'class-validator';
import { User } from '../user.entity';

export class CreateUserDto extends User {
  @IsString()
  @Matches(/^[A-Za-z][A-Za-z0-9]*$/, {
    message: `English or number characters only`,
  })
  username?: string;

  @IsEmail()
  email: string;

  @IsString()
  password?: string;

  @IsString()
  address?: string;
}
