// pages/_app.tsx

import axios, { AxiosResponse } from 'axios';
import { AppProps } from 'next/app';
import Layout from '../components/layout';

App.getInitialProps = async ({ ctx }: { ctx: any }) => {
  let loginId = '';
  let loginUser = '';
  if (ctx.req) {
    loginId = await ctx.req.cookies['loginId'];
    if (loginId) {
      loginUser = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${loginId}`).then((_res: AxiosResponse) => {
        return _res.data.username;
      });
    }
  }
  return { loginUser: loginUser };
};

export default function App({ Component, pageProps, loginUser }: any) {
  return (
    <Layout loginUser={loginUser}>
      <Component {...pageProps} loginUser={loginUser} />
    </Layout>
  );
}
