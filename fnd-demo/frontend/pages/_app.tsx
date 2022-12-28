// pages/_app.tsx

import axios from 'axios';
import { AppProps } from 'next/app';
import Layout from '../components/layout';

App.getInitialProps = async ({ ctx }: { ctx: any }) => {
  let loginId = '';
  let username = '';
  if (ctx.req) {
    loginId = await ctx.req.cookies['loginUser'];
    if (loginId) {
      username = await axios.get(`${process.env.server_url}`);
    }
  }
  return { loginId: loginId };
};

export default function App({ Component, pageProps, loginUser }: any) {
  return (
    <Layout loginUser={loginUser}>
      <Component {...pageProps} loginUser={loginUser} />
    </Layout>
  );
}
