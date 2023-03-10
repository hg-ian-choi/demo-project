// auth/dto/signin.dto.ts

import { IsEmail, IsString } from 'class-validator';
import { User } from 'src/users/user.entity';

export class SigninDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}
