// pages/product/[id].tsx

import { CircularProgress } from '@mui/material';
import { Box, Container } from '@mui/system';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import { Product } from '../../interfaces/product.interface';
import { ServerSideResponse } from '../../interfaces/serverside-response.interface';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export async function getServerSideProps(context: any) {
  const result: ServerSideResponse<Product> = {};
  if (context.params.id) {
    console.log('context.params.id', context.params.id);
    await instance
      .get(`/products/${context.params.id}`)
      .then((response_: AxiosResponse) => {
        if (response_.status === 200) {
          console.log(response_.data);
          result.data = response_.data;
        }
      })
      .catch((error_: AxiosError) => {
        console.log('[product / id] => ', error_);
        result.error = error_.response?.status;
      });
  }
  return { props: result };
}

export default function ProductDetail(props: ServerSideResponse<Product>) {
  const { data, error } = props;

  const [progress, setProgress] = useState(false);

  console.log('data?.id', data?.id);
  console.log('data?.collection', data?.collection);
  console.log('data?.editions', data?.editions);

  return (
    <Container>
      {progress ? (
        <Box width={'100%'} height={'700px'} display={'flex'} justifyContent="center" alignItems={'center'}>
          <CircularProgress />
        </Box>
      ) : (
        <Container>
          <Box>Hello, World</Box>
        </Container>
      )}
    </Container>
  );
}
