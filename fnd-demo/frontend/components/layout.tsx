// components/layout.js

import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { loginUserSelector, setLoginUser } from '../store/loginUserSlice';
import Navbar from './navbar';

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useSelector(loginUserSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const cookiesArray = document.cookie.split(';');
    const cookies: any = cookiesArray.reduce((a, v) => ({ ...a, [v.trim().split('=')[0]]: v.trim().split('=')[1] }), {});
    if (cookies?.userId && cookies?.username) {
      dispatch(setLoginUser({ ...user, userId: cookies.userId, username: cookies.username, wallet: cookies.wallet }));
    }
  }, []);

  const signOut = async () => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signout`, {}, { withCredentials: true })
      .then((_res: AxiosResponse) => {
        if (_res.status === 201 && _res.data) {
          dispatch(setLoginUser({ userId: '', username: '', wallet: '' }));
          router.push('/');
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
