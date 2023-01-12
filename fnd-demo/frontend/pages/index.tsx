// pages/index.tsx

import Head from 'next/head';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { loginUserSelector } from '../store/loginUserSlice';

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Home() {
  const user = useSelector(loginUserSelector);

  return (
    <>
      <Head>
        <title>FND Demo</title>
        <meta name="description" content="FND Demo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container>
          <h1>{user.username ? `Welcome, ${user.username}!` : 'Hello, World!'}</h1>
        </Container>
      </main>
    </>
  );
}
