// pages/signup.tsx

import styled from '@emotion/styled';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Web3 from 'web3';
import { useAppDispatch } from '../store/hooks';
import { loginUserSelector, setLoginUser } from '../store/loginUserSlice';

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
  margin: 0 20px;
`;

const InputSubDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonWrap = styled.div`
  margin: 0 auto;
`;

export default function SignUp() {
  const router = useRouter();
  const [signUpObject1, setSignUpObject1] = useState({ email: '', password: '' });
  const [signUpObject2, setSignUpObject2] = useState({ email: '', address: '', connected: false });
  const [warning1, setWarning1] = useState({ email: '', password: '' });
  const [warning2, setWarning2] = useState({ email: '', password: '' });

  const user = useSelector(loginUserSelector);
  const dispatch = useAppDispatch();

  const changePasswordSignUpObject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log('name', name, value);
    if (name === 'email1') {
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
    if (name === 'email2') {
      setSignUpObject2({ ...signUpObject2, email: value.trim() });
      setWarning2({ ...warning2, email: '' });
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
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(signUpObject2.email)) {
      setWarning2({ ...warning2, email: 'Email is incorrect' });
      return;
    }
    if (signUpObject2.connected) {
    } else {
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

      if (!confirm(`Connect account(${from}) to fnd-demo`)) return;

      let signed = '';
      try {
        signed = await web3.eth.personal.sign(
          `${process.env.NEXT_PUBLIC_SIGNUP_MESSAGE}`.toString(),
          from,
          `${process.env.NEXT_PUBLIC_SIGNATURE_PASSWORD}`
        );
      } catch (_error: any) {
        if (_error.code === 4001) {
          alert('User denied message signature');
        }
      }

      let result = false;
      if (!signed) return;
      result = await axios
        .patch(`${process.env.NEXT_PUBLIC_API_URL}/users/connectWallet`, { wallet: from, sign: signed }, { withCredentials: true })
        .then((_res: AxiosResponse) => {
          dispatch(setLoginUser({ ...user, wallet: from }));
          return _res.data;
        })
        .catch((_err: AxiosError) => {
          const data: any = _err.response?.data;
          alert(data.message);
          return false;
        });

      if (result) {
        alert('Successfully connected Metamask');
      }
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
        <SignUpDiv>
          <SignUpTitle>Sign Up with Email</SignUpTitle>
          <InputDiv>
            <label htmlFor="email1">email</label>
            <InputSubDiv>
              <input type="text" name="email1" value={signUpObject1.email} onChange={changePasswordSignUpObject} />
              <div style={{ color: 'red' }}>{warning1.email}</div>
            </InputSubDiv>
          </InputDiv>
          <br />
          <InputDiv>
            <label htmlFor="password">password</label>
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
        <Divider />
        <SignUpDiv>
          <SignUpTitle>Sign Up with Metamask</SignUpTitle>
          <InputDiv>
            <label htmlFor="email2">email</label>
            <InputSubDiv>
              <input type="text" name="email2" value={signUpObject2.email} onChange={changeMetamaskSignUpObject} />
              <div style={{ color: 'red' }}>{warning2.email}</div>
            </InputSubDiv>
          </InputDiv>
          <br />
          <InputDiv>
            <label htmlFor="address">address</label>
            <InputSubDiv>
              <input type="text" name="address" disabled={signUpObject2.address ? false : true} readOnly />
              <div style={{ color: 'red' }}>{warning2.password}</div>
            </InputSubDiv>
          </InputDiv>
          <br />
          <br />
          <ButtonWrap>
            <button onClick={onMetamaskSignUp}>{signUpObject2.address ? 'Sign Up' : 'Connect Metamask'}</button>
          </ButtonWrap>
        </SignUpDiv>
      </SignUpContainer>
    </Container>
  );
}
