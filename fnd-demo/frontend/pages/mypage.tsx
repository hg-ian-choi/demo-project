// pages/mypage.tsx

import styled from '@emotion/styled';
import axios, { Axios, AxiosResponse } from 'axios';
import { use, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { loginUserSelector, setLoginUser } from '../store/loginUserSlice';
import Web3 from 'web3';

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SignInDiv = styled.div`
  min-width: 300px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
`;

const InputDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ButtonWrap = styled.div`
  margin: 0 auto;
`;

export default function MyPage() {
  const user = useSelector(loginUserSelector);
  const dispatch = useAppDispatch();
  const [wallet, setWallet] = useState(user.wallet);

  const connectMetamask = async () => {
    const customWindow: any = window;
    if (typeof customWindow?.ethereum === 'undefined') {
      if (confirm('Open new tab for installing metamask?')) {
        window.open('https://metamask.io/');
      }
      return;
    }
    const accounts = await customWindow.ethereum.request({ method: 'eth_requestAccounts' });
    customWindow.ethereum.on('accountsChanged', function (accounts: string[]) {
      setWallet(accounts[0]);
    });
    setWallet(accounts[0]);
  };

  const confirmConnect = async () => {
    await axios
      .patch(`${process.env.NEXT_PUBLIC_API_URL}/users/connectWallet`, { wallet: wallet }, { withCredentials: true })
      .then((_res: AxiosResponse) => {
        if (_res.status === 200 && _res.data) {
          dispatch(setLoginUser({ ...user, wallet: _res.data.wallet_address }));
        }
      });
  };

  const signMessage = async () => {
    const customWindow: any = window;
    if (typeof customWindow?.ethereum === 'undefined') {
      if (confirm('Open new tab for installing metamask?')) {
        window.open('https://metamask.io/');
      }
      return;
    }

    const web3 = new Web3(Web3.givenProvider);

    if (!web3) return;
    let from = '';
    try {
      from = (await web3.eth.requestAccounts())[0];
    } catch (_error: any) {
      if (_error?.code === -32002) {
        alert('Already processing: Please check your Metamask');
      }
    }

    let signed = '';
    try {
      signed = await web3.eth.personal.sign('Hello, World!', from, '');
    } catch (_error: any) {
      if (_error.code === 4001) {
        alert('User denied message signature');
      }
    }

    if (!signed) return;
    const result = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/connectWallet`,
      { wallet: from[0], sign: signed },
      { withCredentials: true }
    );

    if (result) {
      alert('Successfully connected Metamask');
    } else {
      alert('Failed to connect Metamask');
    }
  };

  return (
    <Container>
      <h1>My Page</h1>
      <div>
        <div>Username: {user.username}</div>
        <br />
        {user.wallet ? (
          <div>
            <div>Wallet: {user.wallet || wallet}</div>
            <br />
            <button onClick={signMessage}>Sign</button>
          </div>
        ) : wallet ? (
          <div>
            <div>Wallet: {wallet}</div>
            <br />
            <button onClick={confirmConnect}>Confirm Connect</button>
          </div>
        ) : (
          <button onClick={connectMetamask}>Connect Metamask</button>
        )}
      </div>
    </Container>
  );
}
