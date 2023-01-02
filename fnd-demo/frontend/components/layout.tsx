// components/layout.js

import { ReactNode, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setLoginUser } from '../store/loginUserSlice';
import Navbar from './navbar';

export default function Layout({ children, username }: { children: ReactNode; username: string }) {
  console.log('username', username);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoginUser({ username: username }));
  }, [dispatch, username]);

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
