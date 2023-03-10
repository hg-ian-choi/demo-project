// pages/api/web3.ts

import Web3 from 'web3';

export const checkProvider = () => {
  if (!Web3.givenProvider) {
    if (confirm('Open new tab for installing metamask?')) {
      window.open('https://metamask.io/');
    }
    return false;
  }
  return true;
};

export const getAccount = async () => {
  if (!checkProvider()) return null;

  const web3 = new Web3(Web3.givenProvider);

  return web3.eth
    .requestAccounts()
    .then((accounts_: string[]) => {
      return accounts_[0];
    })
    .catch((error_: any) => {
      if (error_.code === -32002) {
        alert('Already processing, please Open Metamask');
        return null;
      }
    });
};

export const personalSign = async (message_: string, password_: string) => {
  if (!checkProvider()) return null;

  const web3 = new Web3(Web3.givenProvider);

  const account = await getAccount();

  if (!account) return null;

  return web3.eth.personal
    .sign(message_, account, password_)
    .then((result_: string) => {
      return result_;
    })
    .catch((error_: any) => {
      if (error_.code === 4001) {
        alert('User denied message signature');
        return null;
      }
    });
};

export const getContractInstance = async (abi_: any, address_: string) => {
  if (!abi_ || !address_) throw new Error('ABI or Contract Address not found!');

  if (!checkProvider()) return new Error('Metamask not found!');

  const web3 = new Web3(Web3.givenProvider);
  const contractInstance = new web3.eth.Contract(abi_, address_);

  return contractInstance;
};

export const fromWei = (value_: string) => {
  return Web3.utils.fromWei(value_);
};

export const toWei = (value_: string) => {
  return Web3.utils.toWei(value_);
};
