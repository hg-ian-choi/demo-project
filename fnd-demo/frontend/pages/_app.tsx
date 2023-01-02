// pages/_app.tsx

import { AppProps } from 'next/app';
import { Provider, useSelector } from 'react-redux';
import Layout from '../components/layout';
import { selectCount } from '../store/loginUserSlice';
import { useAppDispatch } from '../store/hooks';
import { store } from '../store/store';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const user = useSelector(selectCount);
  const dispatch = useAppDispatch();

  useEffect(() => {}, []);

  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
