// pages/api/auth/[...nextauth].ts

import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import axios, { AxiosError, AxiosResponse } from 'axios';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'example@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email) {
          alert('Email is required');
          return null;
        }
        if (!credentials?.password) {
          alert('Password is required');
          return null;
        }
        const user = await axios
          .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, credentials, { withCredentials: true })
          .then((_res: AxiosResponse) => {
            if (_res.status && _res.status === 201) {
              return _res.data;
            }
          })
          .catch((_error: AxiosError) => {
            const data: any = _error.response?.data;
            if (data.statusCode && data.statusCode === 404) {
              alert(data.message);
            }
          });
        console.log(user);
        if (user) {
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    redirect() {
      return '/';
    },
  },
});
