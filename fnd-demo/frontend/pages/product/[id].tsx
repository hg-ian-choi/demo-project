// pages/product/[id].tsx

import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export function getServerSideProps(context: any) {
  if (context.params.id) {
    console.log('context.params.id', context.params.id);
  }
  return { props: {} };
}

export default function ProductDetail(props: {}) {
  return <>Hello, World!</>;
}
