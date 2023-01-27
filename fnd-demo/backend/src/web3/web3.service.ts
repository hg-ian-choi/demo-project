import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';
import { AbiItem } from './interfaces/abi.interfaces';

@Injectable()
export class Web3Service {
  constructor(private readonly configService: ConfigService) {}

  private web3 = new Web3(this.configService.get<string>('web3Provider'));

  public getContractInstance(abi_: AbiItem[] | AbiItem, address_: string): any {
    return new this.web3.eth.Contract(abi_, address_);
  }

  public getSignerFromSign(message_: string, sign_: string): string {
    return this.web3.eth.accounts.recover(message_, sign_);
  }

  public sha3(value_: string): string {
    return this.web3.utils.sha3(value_);
  }

  public get64LengthAddress(address_: string): string {
    return this.web3.utils.padLeft(address_, 64);
  }
}
