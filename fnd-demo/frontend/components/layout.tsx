// components/layout.js

import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { ReactNode, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { loginUserSelector, setLoginUser } from '../store/loginUserSlice';
import Image from 'next/image';

const instance = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const loginUser = useSelector(loginUserSelector);
  const dispatch = useAppDispatch();

  const loadCookie = useCallback((): boolean => {
    const cookiesArray = document.cookie.split(';');
    const cookies: any = cookiesArray.reduce((a, v) => ({ ...a, [v.trim().split('=')[0]]: v.trim().split('=')[1] }), {});
    if (cookies?.userId && cookies?.username) {
      dispatch(setLoginUser({ userId: cookies.userId, username: cookies.username, wallet: cookies.wallet }));
      return true;
    } else {
      dispatch(setLoginUser({ userId: '', username: '', wallet: '' }));
      return false;
    }
  }, [dispatch, router]);

  useEffect(() => {
    loadCookie();
  }, [loadCookie]);

  const turnToHome = () => {
    router.push('/');
  };

  const turnToCollection = () => {
    router.push('/collection');
  };

  const turnToSignIn = () => {
    router.push('/signin');
  };

  const turnToSignUp = () => {
    router.push('/signup');
  };

  const signOut = async () => {
    await instance
      .post(`/auth/signout`)
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
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={turnToHome}>
              <Image src={'/favicon.ico'} width={50} height={50} alt={'favicon'} />
            </IconButton>
            {loginUser.userId ? (
              <div>
                <Button color="inherit" onClick={turnToCollection}>
                  my collection
                </Button>
                <Button color="inherit" onClick={signOut}>
                  signout
                </Button>
              </div>
            ) : (
              <div>
                <Button color="inherit" onClick={turnToSignIn}>
                  signin
                </Button>
                <Button color="inherit" onClick={turnToSignUp}>
                  signup
                </Button>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <main>{children}</main>
    </>
  );
}
