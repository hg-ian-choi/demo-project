// pages/signup.tsx

import styled from '@emotion/styled';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';

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
`;

const ButtonWrap = styled.div`
  margin: 0 auto;
`;

export default function SignUp() {
  const router = useRouter();
  const [signUpObject1, setSignUpObject1] = useState({ email: '', password: '' });
  const [signUpObject2, setSignUpObject2] = useState({ email: '', password: '', step: 0 });

  const changePasswordSignUpObject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log('name', name, value);
    if (name === 'email1') {
      setSignUpObject1({ ...signUpObject1, email: value });
    } else {
      setSignUpObject1({ ...signUpObject1, password: value });
    }
  };

  const changeMetamaskSignUpObject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === 'email2') {
      setSignUpObject2({ ...signUpObject2, email: value });
    }
  };

  const onPasswordSignUp = async () => {
    if (!signUpObject1.email) {
      alert('Email is required');
      return;
    }
    if (!signUpObject1.password) {
      alert('Password is required');
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
      alert('Email is required');
      return;
    }
    if (signUpObject2.step === 0) {
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
            <input type="text" name="email1" value={signUpObject1.email} onChange={changePasswordSignUpObject} />
          </InputDiv>
          <br />
          <InputDiv>
            <label htmlFor="password">password</label>
            <input type="password" name="password" value={signUpObject1.password} onChange={changePasswordSignUpObject} />
          </InputDiv>
          <br />
          <br />
          <ButtonWrap>
            <button onClick={onPasswordSignUp}>sign up</button>
          </ButtonWrap>
        </SignUpDiv>
        <Divider></Divider>
        <SignUpDiv>
          <SignUpTitle>Sign Up with Metamask</SignUpTitle>
          <InputDiv>
            <label htmlFor="email2">email</label>
            <input type="text" name="email2" value={signUpObject2.email} onChange={changeMetamaskSignUpObject} />
          </InputDiv>
          <br />
          <InputDiv>
            <label htmlFor="address">address</label>
            <input type="text" name="address" disabled />
          </InputDiv>
          <br />
          <br />
          <ButtonWrap>
            <button onClick={onMetamaskSignUp}>{signUpObject2.step === 0 ? 'Connect Metamask' : 'Sign up'}</button>
          </ButtonWrap>
        </SignUpDiv>
      </SignUpContainer>
    </Container>
  );
}
