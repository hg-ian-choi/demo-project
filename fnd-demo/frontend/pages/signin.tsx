// pages/signup.tsx

import styled from '@emotion/styled';
import { Button, TextField } from '@mui/material';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Web3 from 'web3';
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
  align-items: center;
`;

const ButtonWrap = styled.div`
  margin: 0 auto;
`;

export default function SignIn() {
  const web3 = new Web3(Web3.givenProvider);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signInObject, setSignInObject] = useState({ email: '', password: '' });
  const [warning, setWarning] = useState({ email: '', password: '' });

  const changeSignInObject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === 'email') {
      setSignInObject({ ...signInObject, email: value });
      setWarning({ ...warning, email: '' });
    } else {
      setSignInObject({ ...signInObject, password: value });
      setWarning({ ...warning, password: '' });
    }
  };

  const onSignIn = async () => {
    if (!signInObject.email) {
      // alert('Email is required');
      setWarning({ ...warning, email: 'Email is required' });
      return;
    }
    if (!signInObject.password) {
      // alert('Password is required');
      setWarning({ ...warning, password: 'Password is required' });
      return;
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(signInObject.email)) {
      setWarning({ ...warning, email: 'Email is incorrect' });
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
        if (data.statusCode) {
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
    const account = (await customWindow.ethereum.request({ method: 'eth_requestAccounts' }))[0];

    const password = await web3.eth.personal.sign(
      `${process.env.NEXT_PUBLIC_SIGNUP_MESSAGE}`.toString(),
      account,
      `${process.env.NEXT_PUBLIC_SIGNATURE_PASSWORD}`
    );

    console.log('password', password);

    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, { email: 'email', password: password }, { withCredentials: true })
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
          alert(`account(${account})\nnot found`);
        }
      });
  };

  return (
    <Container>
      <h1>Sign In</h1>
      <SignInDiv>
        <InputDiv>
          <label htmlFor="email">email</label>
          <div>
            <TextField label="email" name="email" variant="outlined" value={signInObject.email} onChange={changeSignInObject} />
            {/* <input type="text" name="email" value={signInObject.email} onChange={changeSignInObject} /> */}
            <div style={{ color: 'red' }}>{warning.email}</div>
          </div>
        </InputDiv>
        <br />
        <InputDiv>
          <label htmlFor="password">password</label>
          <div>
            <TextField
              label="password"
              name="password"
              type="password"
              variant="outlined"
              value={signInObject.password}
              onChange={changeSignInObject}
            />
            <div style={{ color: 'red' }}>{warning.password}</div>
          </div>
          {/* <input type="password" name="password" value={signInObject.password} onChange={changeSignInObject} /> */}
        </InputDiv>
        <br />
        <br />
        <ButtonWrap>
          <Button variant="contained" onClick={onSignIn}>
            Sign In
          </Button>
          {/* <button onClick={onSignIn}>sign in</button> */}
        </ButtonWrap>
      </SignInDiv>
      <div style={{ borderTop: '1px solid black', width: '50%', margin: '30px 0' }} />
      {/* <button onClick={signInWithMetamask}>Signin with Metamask</button> */}
      <Button variant="contained" onClick={signInWithMetamask}>
        Sign In with Metamask
      </Button>
    </Container>
  );
}
