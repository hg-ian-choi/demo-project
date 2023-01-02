// pages/_app.tsx

import { AppProps } from 'next/app';
import { useEffect } from 'react';
import Layout from '../components/layout';

App.getInitialProps = async (ctx: any) => {
  let username = '';
  if (ctx.ctx.req) {
    username = ctx.ctx.req.cookies['username'];
  }
  return { username: username };
};

export default function App({ Component, ...pageProps }: any) {
  const { username } = pageProps;
  useEffect(() => {
    console.log('username', username);
  }, [username]);

  return (
    <Layout {...pageProps}>
      <Component {...pageProps} />
    </Layout>
  );
}
