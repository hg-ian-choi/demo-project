// pages/signup.tsx

import styled from '@emotion/styled';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';

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
        if (_res.status && _res.status === 201) {
          console.log('_res', _res);
        }
      })
      .catch((_error: AxiosError) => {
        const data: any = _error.response?.data;
        if (data.statusCode && data.statusCode === 404) {
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
      <button>Signin with Metamask</button>
    </Container>
  );
}
