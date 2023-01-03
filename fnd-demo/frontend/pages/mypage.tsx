// pages/mypage.tsx

import styled from '@emotion/styled';
import axios, { Axios, AxiosResponse } from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { loginUserSelector, setLoginUser } from '../store/loginUserSlice';

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
  const [wallet, setWallet] = useState('');

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

  return (
    <Container>
      <h1>My Page</h1>
      <div>
        <div>Username: {user.username}</div>
        <br />
        {user.wallet ? (
          <div>Wallet: {user.wallet || wallet}</div>
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
