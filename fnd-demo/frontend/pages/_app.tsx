import App, { AppInitialProps } from 'next/app';
import Layout from '../components/layout';
import wrapper from '../store/store';
import { setUser } from '../store/userSlice';

class MyApp extends App<AppInitialProps> {
  public static getInitialProps = wrapper.getInitialAppProps((store) => async (ctx: any) => {
    console.log('2. Page.getInitialProps uses the store to dispatch things');
    if (ctx.ctx.req?.cookies) {
      const cookies = ctx.ctx.req?.cookies;
      let userId = await cookies['loginId'];
      let username = await cookies['username'];
      store.dispatch(setUser({ userId: userId, username: username }));
    }
    return {
      pageProps: {
        ...(await App.getInitialProps(ctx)).pageProps,
      },
    };
  });

  public render(): JSX.Element {
    const { Component, pageProps } = this.props;

    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default wrapper.withRedux(MyApp);
