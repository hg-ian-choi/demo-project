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
  if (!checkProvider()) {
    return null;
  }

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
  if (!checkProvider()) {
    return null;
  }

  const web3 = new Web3(Web3.givenProvider);

  const account = await getAccount();

  if (!account) return;

  return web3.eth.personal
    .sign(message_, account, password_)
    .then((result_: string) => {
      console.log('result_', result_);
      return result_;
    })
    .catch((error_: any) => {
      if (error_.code === 4001) {
        alert('User denied message signature');
        return null;
      }
    });
};
