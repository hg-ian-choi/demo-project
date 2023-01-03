// pages/signup.tsx

import styled from '@emotion/styled';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';

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

const InputDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ButtonWrap = styled.div`
  margin: 0 auto;
`;

export default function SignUp() {
  const router = useRouter();
  const [signUpObject, setSignUpObject] = useState({ email: '', password: '' });

  const changeSignUpObject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === 'email') {
      setSignUpObject({ ...signUpObject, email: value });
    } else {
      setSignUpObject({ ...signUpObject, password: value });
    }
  };

  const onSignUp = async () => {
    if (!signUpObject.email) {
      alert('Email is required');
      return;
    }
    if (!signUpObject.password) {
      alert('Password is required');
      return;
    }
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/users`, signUpObject)
      .then((_res: AxiosResponse) => {
        if (_res.status === 201) {
          alert('Successfully signed up');
          router.push('/');
        }
      })
      .catch((_error: AxiosError) => {
        alert('Failed to sign up');
      });
  };

  return (
    <Container>
      <h1>Sign Up</h1>
      <SignUpDiv>
        <InputDiv>
          <label htmlFor="email">email</label>
          <input type="text" name="email" value={signUpObject.email} onChange={changeSignUpObject} />
        </InputDiv>
        <br />
        <InputDiv>
          <label htmlFor="password">password</label>
          <input type="password" name="password" value={signUpObject.password} onChange={changeSignUpObject} />
        </InputDiv>
        <br />
        <br />
        <ButtonWrap>
          <button onClick={onSignUp}>sign up</button>
        </ButtonWrap>
      </SignUpDiv>
    </Container>
  );
}
