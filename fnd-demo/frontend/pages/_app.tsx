// pages/_app.tsx

import { Provider } from 'react-redux';
import Layout from '../components/layout';
import store from '../store/store';

App.getInitialProps = async (ctx: any) => {
  let username = '';
  if (ctx.ctx.req) {
    username = ctx.ctx.req.cookies['username'];
  }
  return { username: username };
};

export default function App({ Component, ...pageProps }: any) {
  const { username } = pageProps;

  return (
    <Provider store={store}>
      <Layout username={username}>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
