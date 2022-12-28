import { User } from '../user.entity';

export class CreateUserDto extends User {
  username: string;
  password: string;
  address?: string;
}
