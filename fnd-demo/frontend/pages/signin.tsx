// pages/signup.tsx

import styled from '@emotion/styled';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setLoginUser } from '../store/loginUserSlice';

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

export default function SignIn() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signInObject, setSignInObject] = useState({ email: '', password: '' });

  const changeSignInObject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === 'email') {
      setSignInObject({ ...signInObject, email: value });
    } else {
      setSignInObject({ ...signInObject, password: value });
    }
  };

  const onSignIn = async () => {
    if (!signInObject.email) {
      alert('Email is required');
      return;
    }
    if (!signInObject.password) {
      alert('Password is required');
      return;
    }
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, signInObject, { withCredentials: true })
      .then((_res: AxiosResponse) => {
        if (_res.status === 201 && _res.data) {
          dispatch(setLoginUser({ userId: _res.data.userId, username: _res.data.username, wallet: _res.data.wallet }));
          alert(`Welcome ${_res.data.username}`);
          router.push('/');
        }
      })
      .catch((_error: AxiosError) => {
        const data: any = _error.response?.data;
        if (data.statusCode && data.statusCode === 404) {
          alert(data.message);
        }
      });
  };

  const signInWithMetamask = async () => {
    const customWindow: any = window;
    if (typeof customWindow?.ethereum === 'undefined') {
      if (confirm('Open new tab for installing metamask?')) {
        window.open('https://metamask.io/');
      }
      return;
    }
    const accounts = await customWindow.ethereum.request({ method: 'eth_requestAccounts' });
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin/wallet`, { wallet: accounts[0], password: 'password' }, { withCredentials: true })
      .then((_res: AxiosResponse) => {
        if (_res.status === 201 && _res.data) {
          dispatch(setLoginUser({ userId: _res.data.userId, username: _res.data.username, wallet: _res.data.wallet }));
          alert(`Welcome ${_res.data.username}`);
          router.push('/');
        }
      })
      .catch((_err: AxiosError) => {
        const data: any = _err.response?.data;
        if (data) {
          alert(data.message);
        }
      });
  };

  return (
    <Container>
      <h1>Sign In</h1>
      <SignInDiv>
        <InputDiv>
          <label htmlFor="email">email</label>
          <input type="text" name="email" value={signInObject.email} onChange={changeSignInObject} />
        </InputDiv>
        <br />
        <InputDiv>
          <label htmlFor="password">password</label>
          <input type="password" name="password" value={signInObject.password} onChange={changeSignInObject} />
        </InputDiv>
        <br />
        <br />
        <ButtonWrap>
          <button onClick={onSignIn}>sign in</button>
        </ButtonWrap>
      </SignInDiv>
      <div style={{ borderTop: '1px solid black', width: '50%', margin: '30px 0' }} />
      <button onClick={signInWithMetamask}>Signin with Metamask</button>
    </Container>
  );
}
