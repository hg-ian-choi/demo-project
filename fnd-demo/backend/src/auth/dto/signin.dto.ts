import { IsEmail, IsString } from 'class-validator';
import { User } from 'src/users/user.entity';

export class SigninDto extends User {
  @IsEmail()
  email?: string;

  @IsString()
  password?: string;

  @IsString()
  wallet_address?: string;
}
