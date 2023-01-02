// components/layout.js

import { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './navbar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
