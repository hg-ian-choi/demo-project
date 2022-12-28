// components/layout.js

import Navbar from './navbar';

export default function Layout({ children, loginUser }: { children: any; loginUser: string }) {
  return (
    <>
      <Navbar loginUser={loginUser} />
      <main>{children}</main>
    </>
  );
}
