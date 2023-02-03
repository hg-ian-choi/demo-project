// pages/product/[id].tsx

import { Card, CircularProgress, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import axios, { AxiosError, AxiosResponse } from 'axios';
import Image from 'next/image';
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

  return (
    <Container>
      {progress ? (
        <Box width={'100%'} height={'700px'} display={'flex'} justifyContent="center" alignItems={'center'}>
          <CircularProgress />
        </Box>
      ) : (
        data &&
        data.collection &&
        data.creator &&
        data.editions && (
          <Container>
            <Container>
              <Box display={'flex'} flexDirection={'column'} m={'30px auto'} alignItems={'center'}>
                <Box position={'relative'} width={'50vw'} height={'50vw'} m={'0 auto 30px'}>
                  <Image src={data.image} alt={'image'} fill />
                </Box>
                <Box width={'400px'}>
                  <Box display={'flex'} justifyContent={'space-between'} m={'10px 0'}>
                    <Typography>name: </Typography>
                    <Typography>{data.name}</Typography>
                  </Box>
                  {data.description && (
                    <Box display={'flex'} justifyContent={'space-between'} m={'10px 0'}>
                      <Typography>description: </Typography>
                      <Typography maxWidth={'300px'}>{data?.description}</Typography>
                    </Box>
                  )}
                  <Box display={'flex'} justifyContent={'space-between'} m={'10px 0'}>
                    <Typography>Token Address: </Typography>
                    <Typography>{data.collection.address?.slice(0, 5).concat('...').concat(data.collection.address.slice(-5))}</Typography>
                  </Box>
                  <Box display={'flex'} justifyContent={'space-between'} m={'10px 0'}>
                    <Typography>Token Id: </Typography>
                    <Typography>{data.token_id}</Typography>
                  </Box>
                  <Box display={'flex'} justifyContent={'space-between'} m={'10px 0'}>
                    <Typography>Total edition: </Typography>
                    <Typography>{data.total_edition}</Typography>
                  </Box>
                </Box>
              </Box>
            </Container>
            <Container>
              <Box>Histories: </Box>
              {data.editions.map((edition_, index_) => {
                console.log('edition_', edition_);
                return <Box key={`edition_${index_}`}></Box>;
              })}
            </Container>
          </Container>
        )
      )}
    </Container>
  );
}
