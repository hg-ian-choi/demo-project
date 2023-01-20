// pages/mypage.tsx

import styled from '@emotion/styled';
import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import { use, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { loginUserSelector, setLoginUser } from '../store/loginUserSlice';
import Web3 from 'web3';
import { Container } from '@mui/material';

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

  const confirmConnect = async () => {};

  return (
    <Container maxWidth="lg">
      <h1>My Page</h1>
      <div>
        <div>Username: {user.username}</div>
        <br />
        {user.wallet ? (
          <div>
            <div>Wallet: {user.wallet || wallet}</div>
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
