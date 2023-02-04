// pages/product/[id].tsx

import { Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import axios, { AxiosError, AxiosResponse } from 'axios';
import Image from 'next/image';
import { useState } from 'react';
import { ProductHistory } from '../../interfaces/product-history.interface';
import { ProductHistoryType } from '../../enums/product-history-type.enum';
import { ProductStatus } from '../../enums/product-status.enum';
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
          console.log('response_.data', response_.data);
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
            {data && data.editions && (
              <Container>
                <Box mt={10}>Editions: </Box>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Creator</TableCell>
                        <TableCell align="center">Owner</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.editions.map((edition_) => {
                        return (
                          <TableRow key={edition_.edition.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row" align="center">
                              {data.name}
                            </TableCell>
                            <TableCell align="center">{data.creator.username}</TableCell>
                            <TableCell align="center">{edition_.edition.owner.username}</TableCell>
                            <TableCell align="center">{edition_.edition.price.toString() === '0' ? '-' : edition_.edition.price}</TableCell>
                            <TableCell align="center">{ProductStatus[edition_.edition.status]}</TableCell>
                            <TableCell align="center">
                              {edition_.edition.status.toString() === '1' ? (
                                '-'
                              ) : (
                                <Button
                                  onClick={() => {
                                    console.log(edition_.edition.status, edition_.edition.owner.id);
                                  }}
                                >
                                  Buy now
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Container>
            )}
            {data && data.histories && (
              <Container>
                <Box mt={10}>Histories: </Box>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Type</TableCell>
                        <TableCell align="center">From</TableCell>
                        <TableCell align="center">To</TableCell>
                        <TableCell align="center">Amount</TableCell>
                        <TableCell align="center">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.histories.map((history_: ProductHistory) => {
                        if (history_.type.toString() === '0') {
                          return;
                        }
                        return (
                          <TableRow key={history_.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row" align="center">
                              {ProductHistoryType[history_.type]}
                            </TableCell>
                            <TableCell align="center">{history_.type.toString() === '1' ? '-' : history_.buyer.username}</TableCell>
                            <TableCell align="center">
                              {history_.type.toString() === '1' ? history_.operator.username : history_.buyer.username}
                            </TableCell>
                            <TableCell align="center">{history_.amount}</TableCell>
                            <TableCell align="center">{history_.price?.toString() === '0' ? '-' : history_.price}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Container>
            )}
          </Container>
        )
      )}
    </Container>
  );
}
