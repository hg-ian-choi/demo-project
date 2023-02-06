// pages/collection/index.tsx

import { Box, Button, Card, CardContent, CircularProgress, Container, Grid, TextField, Typography } from '@mui/material';
import axios, { AxiosError, AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { getAccount, getContractInstance } from '../api/web3';
import { loginUserSelector } from '../../store/loginUserSlice';
import factoryABI from '../../abis/factory.abi.json';
import { Collection } from '../../interfaces/collection.interface';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export async function getServerSideProps(context_: any) {
  let collections: any = [];
  if (context_.req.headers.cookie) {
    collections = await instance
      .get('/collections/user', { headers: { Cookie: context_.req.headers.cookie } })
      .then((response_: AxiosResponse) => {
        return response_.data;
      })
      .catch((error_: AxiosError) => {
        console.log('[collection/index getServerSideProps error_] => ', error_);
        return [];
      });
  }
  return {
    props: { collections },
  };
}

export default function Collections(props: any) {
  const { collections } = props;

  const router = useRouter();
  const loginUser = useSelector(loginUserSelector);

  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(false);
  const [collectionsState, setCollectionsState] = useState(collections);
  const [createCollectionObject, setCreateCollectionObject] = useState({ name: '', symbol: '' });
  const [createCollectionWarnning, setCreateCollectionWarning] = useState({ name: '', symbol: '' });

  const nextStep = (step_: number) => {
    setStep(step_);
  };

  const onCreateCollectionObjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'name') {
      setCreateCollectionWarning({ ...createCollectionWarnning, name: '' });
      setCreateCollectionObject({ ...createCollectionObject, name: event.target.value });
    } else {
      setCreateCollectionObject({ ...createCollectionObject, symbol: event.target.value });
      setCreateCollectionWarning({ ...createCollectionWarnning, symbol: '' });
    }
  };

  const createCollection = async () => {
    if (!createCollectionObject.name) {
      setCreateCollectionWarning({ ...createCollectionWarnning, name: 'Name is required' });
      return;
    }
    if (!createCollectionObject.symbol) {
      setCreateCollectionWarning({ ...createCollectionWarnning, symbol: 'Symbol is required' });
      return;
    }

    const account = await getAccount();
    if (!account) throw new Error('Metamask account not found!');

    const cookiesArray = document.cookie.split(';');
    const cookiesMap: any = {};
    for await (const cookie_ of cookiesArray) {
      const _cookie = cookie_.trim().split('=');
      cookiesMap[_cookie[0]] = _cookie[1];
    }

    if (account.toLowerCase() !== loginUser.wallet) {
      console.log(account, loginUser.wallet);
      alert('Only Signed up Metamask can use');
      return;
    }

    if (account.toLowerCase() !== cookiesMap['wallet']) {
      alert('Session is expired, please sign in');
      router.push('/signin');
      return;
    }

    setProgress(true);
    const _collection: Collection = await instance
      .post(`${process.env.NEXT_PUBLIC_API_URL}/collections`, createCollectionObject)
      .then((response_: AxiosResponse) => {
        if (response_.status === 201) {
          return response_.data;
        }
      })
      .catch((error_: AxiosError) => {
        console.log('[create collection error_] =>', error_);
        return null;
      });

    if (_collection) {
      const contractInstance: any = await getContractInstance(factoryABI, `${process.env.NEXT_PUBLIC_FACTORY}`);

      const _newClone = await contractInstance.methods
        .newClone(_collection.id, createCollectionObject.name, createCollectionObject.symbol)
        .send({ from: account })
        .then((result_: any) => {
          return {
            transactionHash: result_.transactionHash,
            address: result_.events.cloneEvent.returnValues.newClone,
          };
        })
        .catch((error_: any) => {
          console.log('error_', error_.message);
          alert(error_.message);
          return null;
        });

      if (_newClone && _newClone.transactionHash && _newClone.address) {
        await instance
          .patch(`${process.env.NEXT_PUBLIC_API_URL}/collections/${_collection.id}/sync`, {
            address: _newClone.address,
            transactionHash: _newClone.transactionHash,
          })
          .then((response_: AxiosResponse) => {
            if (response_.status === 200) {
              return response_.data;
            }
          })
          .catch((error_: AxiosError) => {
            if (error_.code === '401') {
              alert('Please sign in');
            }
            console.log('error_', error_);
            return null;
          });
      }

      await instance
        .get(`/collections/user`)
        .then((response_: AxiosResponse) => {
          if (response_.status === 200) {
            setCollectionsState(response_.data);
            setStep(0);
          }
        })
        .catch((error_: AxiosError) => {
          console.log('[collection /index] => ', error_);
        });

      setProgress(false);
    }
  };

  const turnToProduct = (productId_: string) => {
    router.push(`/collection/${productId_}`);
  };

  return (
    <Container>
      {progress ? (
        <Box width={'100%'} height={'700px'} display={'flex'} justifyContent="center" alignItems={'center'}>
          <CircularProgress />
        </Box>
      ) : (
        <Container style={{ padding: '30px 0' }}>
          {step === 0 ? (
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Grid container columnGap={3} rowGap={3} justifyContent="center">
                {collectionsState.length > 0 &&
                  collectionsState.map((value_: Collection, index_: number) => (
                    <Grid item xs={3} key={`collection_${index_}`} style={{ border: 'solid 1px black', cursor: 'pointer' }}>
                      <Card
                        onClick={() => {
                          turnToProduct(value_.id);
                        }}
                      >
                        <CardContent>
                          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Collection {index_ + 1}
                          </Typography>
                          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            name: {value_.name}
                          </Typography>
                          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            symbol: {value_.symbol}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
              <Button
                variant="contained"
                onClick={() => {
                  nextStep(1);
                }}
                style={{ margin: '30px 0 0 0' }}
              >
                Create Collection
              </Button>
            </div>
          ) : (
            <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <label htmlFor="name">name</label>
                <div style={{ margin: '0 0 0 30px' }}>
                  <TextField
                    label="name"
                    name="name"
                    type="text"
                    variant="outlined"
                    value={createCollectionObject.name}
                    onChange={onCreateCollectionObjectChange}
                  />
                  <div style={{ color: 'red' }}>{createCollectionWarnning.name}</div>
                </div>
              </Container>
              <br />
              <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <label htmlFor="symbol">symbol</label>
                <div style={{ margin: '0 0 0 30px' }}>
                  <TextField
                    label="symbol"
                    name="symbol"
                    type="text"
                    variant="outlined"
                    value={createCollectionObject.symbol}
                    onChange={onCreateCollectionObjectChange}
                  />
                  <div style={{ color: 'red' }}>{createCollectionWarnning.symbol}</div>
                </div>
              </Container>
              <br />
              <div>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setStep(0);
                    setCreateCollectionWarning({ name: '', symbol: '' });
                    setCreateCollectionObject({ name: '', symbol: '' });
                  }}
                >
                  cancel
                </Button>
                <span style={{ margin: '0 15px' }} />
                <Button variant="contained" onClick={createCollection}>
                  Create Collection
                </Button>
              </div>
            </Container>
          )}
        </Container>
      )}
    </Container>
  );
}
