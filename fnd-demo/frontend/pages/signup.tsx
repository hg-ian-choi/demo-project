// pages/signup.tsx

import styled from '@emotion/styled';
import { Button, TextField } from '@mui/material';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Web3 from 'web3';
import { useAppDispatch } from '../store/hooks';
import { loginUserSelector, setLoginUser } from '../store/loginUserSlice';
import { getAccount, personalSign } from './api/web3';

const SignUpContainer = styled.div`
  display: flex;
`;

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SignUpDiv = styled.div`
  min-width: 300px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
`;

const Divider = styled.div`
  margin: 0 20px;
  border-left: solid 1px black;
`;
const SignUpTitle = styled.h2`
  margin: 0 auto 20px;
`;

const InputDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InputSubDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonWrap = styled.div`
  margin: 0 auto;
`;

export default function SignUp() {
  const web3 = new Web3(Web3.givenProvider);
  const router = useRouter();
  const [signUpObject1, setSignUpObject1] = useState({ username: '', email: '', password: '' });
  const [signUpObject2, setSignUpObject2] = useState({ email: '', password: '', address: '' });
  const [warning1, setWarning1] = useState({ username: '', email: '', password: '' });
  const [warning2, setWarning2] = useState({ username: '', email: '', password: '', address: '' });

  const user = useSelector(loginUserSelector);
  const dispatch = useAppDispatch();

  const changePasswordSignUpObject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === 'username1') {
      setSignUpObject1({ ...signUpObject1, username: value.trim() });
      setWarning1({ ...warning1, username: '' });
    } else if (name === 'email1') {
      setSignUpObject1({ ...signUpObject1, email: value.trim() });
      setWarning1({ ...warning1, email: '' });
    } else {
      setSignUpObject1({ ...signUpObject1, password: value });
      setWarning1({ ...warning1, password: '' });
    }
  };

  const changeMetamaskSignUpObject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === 'email') {
      setSignUpObject2({ ...signUpObject2, email: value.trim() });
      setWarning1({ ...warning2, email: '' });
    } else if (name === 'password') {
      setSignUpObject2({ ...signUpObject2, password: value.trim() });
      setWarning2({ ...warning2, password: '' });
    }
  };

  const onPasswordSignUp = async () => {
    if (!signUpObject1.email) {
      setWarning1({ ...warning1, email: 'Email is required' });
      return;
    }
    if (!signUpObject1.password) {
      setWarning1({ ...warning1, password: 'Password is required' });
      return;
    }
    if (signUpObject1.username && !/^[A-Za-z][A-Za-z0-9]*$/.test(signUpObject1.username)) {
      setWarning1({ ...warning1, username: 'English or number only' });
      return;
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(signUpObject2.email)) {
      alert('Email is incorrect');
      return;
    }
    // axios
    //   .post(`${process.env.NEXT_PUBLIC_API_URL}/users`, signUpObject)
    //   .then((_res: AxiosResponse) => {
    //     if (_res.status === 201) {
    //       alert('Successfully signed up');
    //       router.push('/');
    //     }
    //   })
    //   .catch((_error: AxiosError) => {
    //     alert('Failed to sign up');
    //   });
  };

  const onMetamaskSignUp = async () => {
    if (!signUpObject2.email) {
      setWarning2({ ...warning2, email: 'Email is required' });
      return;
    }
    if (!signUpObject2.password) {
      setWarning2({ ...warning2, password: 'Password is required' });
      return;
    }
    // if (signUpObject2.username && !/^[A-Za-z][A-Za-z0-9]*$/.test(signUpObject2.username)) {
    //   setWarning2({ ...warning2, username: 'English or number only' });
    //   return;
    // }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(signUpObject2.email)) {
      setWarning2({ ...warning2, email: 'Email is incorrect' });
      return;
    }

    if (signUpObject2.address) {
      const signed = await personalSign(`${process.env.NEXT_PUBLIC_SIGNUP_MESSAGE}`.toString(), `${process.env.NEXT_PUBLIC_SIGNATURE_PASSWORD}`);

      if (!signed) return;

      await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/users`, { user: signUpObject2, sign: signed }, { withCredentials: true })
        .then((_res: AxiosResponse) => {
          const data: any = _res.data;
          dispatch(setLoginUser({ ...user, wallet: signUpObject2.address }));
          alert(`Welcome to join us ${data.username}`);
          router.push('/');
        })
        .catch((_err: AxiosError) => {
          const data: any = _err.response?.data;
          if (data?.message) {
            alert(data.message);
          }
          return false;
        });
    } else {
      let account = await getAccount();
      if (!account) return;
      setSignUpObject2({ ...signUpObject2, address: account || '' });

      const customWindow: any = window;
      customWindow.ethereum.on('accountsChanged', (accounts_: string[]) => {
        console.log('accounts_[0]', accounts_[0]);
        if (accounts_[0]) {
          setSignUpObject2({ ...signUpObject2, address: accounts_[0] });
        }
      });
    }

    // axios
    //   .post(`${process.env.NEXT_PUBLIC_API_URL}/users`, signUpObject)
    //   .then((_res: AxiosResponse) => {
    //     if (_res.status === 201) {
    //       alert('Successfully signed up');
    //       router.push('/');
    //     }
    //   })
    //   .catch((_error: AxiosError) => {
    //     alert('Failed to sign up');
    //   });
  };

  return (
    <Container>
      <h1>Sign Up</h1>
      <SignUpContainer>
        {/* signUpDiv>
          <SignUpTitle>Sign Up with Email</SignUpTitle>
          <InputDiv>
            <label htmlFor="username1">username (Optional)</label>
            <InputSubDiv>
              <input type="text" name="username1" value={signUpObject1.username} onChange={changePasswordSignUpObject} />
              <div style={{ color: 'red' }}>{warning1.username}</div>
            </InputSubDiv>
          </InputDiv>
          <br />
          <InputDiv>
            <label htmlFor="email1">
              email<span style={{ color: 'red' }}>*</span>
            </label>
            <InputSubDiv>
              <input type="text" name="email1" value={signUpObject1.email} onChange={changePasswordSignUpObject} />
              <div style={{ color: 'red' }}>{warning1.email}</div>
            </InputSubDiv>
          </InputDiv>
          <br />
          <InputDiv>
            <label htmlFor="password">
              password<span style={{ color: 'red' }}>*</span>
            </label>
            <InputSubDiv>
              <input type="password" name="password" value={signUpObject1.password} onChange={changePasswordSignUpObject} />
              <div style={{ color: 'red' }}>{warning1.password}</div>
            </InputSubDiv>
          </InputDiv>
          <br />
          <br />
          <ButtonWrap>
            <button onClick={onPasswordSignUp}>sign Up</button>
          </ButtonWrap>
        </SignUpDiv>
        <Divider /> */}
        <SignUpDiv>
          {/* <SignUpTitle>Sign Up with Metamask</SignUpTitle>
          <InputDiv>
            <label htmlFor="username2">username (Optional)</label>
            <InputSubDiv>
              <input type="text" name="username2" value={signUpObject2.username} onChange={changeMetamaskSignUpObject} />
              <div style={{ color: 'red' }}>{warning2.username}</div>
            </InputSubDiv>
          </InputDiv>
          <br /> */}
          <InputDiv>
            <label htmlFor="email2">
              email<span style={{ color: 'red' }}>*</span>
            </label>
            <InputSubDiv>
              <TextField label="email" name="email" variant="outlined" value={signUpObject2.email} onChange={changeMetamaskSignUpObject} />
              {/* <input type="text" name="email2" value={signUpObject2.email} onChange={changeMetamaskSignUpObject} /> */}
              <div style={{ color: 'red' }}>{warning2.email}</div>
            </InputSubDiv>
          </InputDiv>
          <br />
          <InputDiv>
            <label htmlFor="password2">
              password<span style={{ color: 'red' }}>*</span>
            </label>
            <InputSubDiv>
              <TextField
                label="password"
                name="password"
                type="password"
                variant="outlined"
                value={signUpObject2.password}
                onChange={changeMetamaskSignUpObject}
              />
              {/* <input type="password" name="password2" value={signUpObject2.password} onChange={changeMetamaskSignUpObject} /> */}
              <div style={{ color: 'red' }}>{warning2.password}</div>
            </InputSubDiv>
          </InputDiv>
          <br />
          <InputDiv>
            <label htmlFor="address">
              address<span style={{ color: 'red' }}>*</span>
            </label>
            <InputSubDiv>
              <TextField
                label="address"
                name="address"
                variant="outlined"
                disabled
                value={
                  signUpObject2.address ? signUpObject2.address.substring(0, 7).concat('...').concat(signUpObject2.address.substring(37, 42)) : ''
                }
              />
              {/* <input
                type="text"
                name="address"
                disabled
                readOnly
                value={
                  signUpObject2.address ? signUpObject2.address.substring(0, 7).concat('...').concat(signUpObject2.address.substring(37, 42)) : ''
                }
              /> */}
              <div style={{ color: 'red' }}>{warning2.address}</div>
            </InputSubDiv>
          </InputDiv>
          <br />
          <br />
          <Button variant="contained" onClick={onMetamaskSignUp}>
            {signUpObject2.address ? 'Sign Up' : 'Connect Metamask'}
          </Button>
        </SignUpDiv>
      </SignUpContainer>
    </Container>
  );
}
