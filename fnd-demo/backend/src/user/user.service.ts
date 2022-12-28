import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: string) {}

  async getUser(_userId: string) {
    return 'Hello, World!';
  }
}
