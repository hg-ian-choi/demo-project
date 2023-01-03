// components/layout.js

import axios, { AxiosError, AxiosResponse } from 'axios';
import { ReactNode, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setLoginUser } from '../store/loginUserSlice';
import Navbar from './navbar';

export default function Layout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const cookiesArray = document.cookie.split(';');
    const cookies: any = cookiesArray.reduce((a, v) => ({ ...a, [v.trim().split('=')[0]]: v.trim().split('=')[1] }), {});
    if (cookies?.username) {
      dispatch(setLoginUser({ username: cookies.username }));
    }
  }, [dispatch]);

  const signOut = async () => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signout`, {}, { withCredentials: true })
      .then((_res: AxiosResponse) => {
        if (_res.status === 201 && _res.data) {
          dispatch(setLoginUser({ username: '' }));
          return _res.data;
        }
      })
      .catch((_error: AxiosError) => {
        console.log('_error', _error);
      });
  };
  return (
    <>
      <Navbar signOut={signOut} />
      <main>{children}</main>
    </>
  );
}
