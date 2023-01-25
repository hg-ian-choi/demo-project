// pages/product/index.ts

import axios, { AxiosError, AxiosResponse } from 'axios';
import { Product } from '../../interfaces/product.interface';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export async function getServerSideProps(context: any) {
  let products: Product[] = {} as Product[];
  products = await instance
    .get('/collections/usser', { headers: { Cookie: context.req.headers.cookie } })
    .then((response_: AxiosResponse) => {
      return response_.data;
    })
    .catch((error_: AxiosError) => {
      console.log('[collection/index getServerSideProps error_] => ', error_);
      return [];
    });
  return { props: products };
}

export default function Products(props: Product[]) {
  console.log('props', props);
  return <>Hello, World!</>;
}
