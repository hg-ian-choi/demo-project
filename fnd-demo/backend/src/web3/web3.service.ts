import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';
import { AbiItem } from './interfaces/abi.interfaces';

@Injectable()
export class Web3Service {
  constructor(private readonly configService: ConfigService) {}

  web3 = new Web3(
    'https://mainnet.infura.io/v3/ef8917d7093a4c54b95cbfff266200bd',
  );

  getContractInstance(abi_: AbiItem[] | AbiItem, address_: string): any {
    return new this.web3.eth.Contract(abi_, address_);
  }

  getSignerFromSign(message_: string, sign_: string): string {
    return this.web3.eth.accounts.recover(message_, sign_);
  }

  sha3(value_: string): string {
    return this.web3.utils.sha3(value_);
  }

  get64LengthAddress(address_: string): string {
    return this.web3.utils.padLeft(address_, 64);
  }
}
