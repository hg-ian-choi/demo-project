import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';

@Injectable()
export class Web3Service {
  constructor(private readonly configService: ConfigService) {}

  web3 = new Web3(
    'https://mainnet.infura.io/v3/ef8917d7093a4c54b95cbfff266200bd',
  );

  async getSignerFromSign(message_: string, sign_: string): Promise<string> {
    const signer = this.web3.eth.accounts.recover(message_, sign_);
    return signer;
  }
}
