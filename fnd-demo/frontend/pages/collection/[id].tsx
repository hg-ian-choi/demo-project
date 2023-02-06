// pages/collection/[id].tsx

import { Button, Card, CardContent, CircularProgress, Container, Grid, TextareaAutosize, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios, { AxiosError, AxiosResponse } from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Collection } from '../../interfaces/collection.interface';
import { Product } from '../../interfaces/product.interface';
import { getAccount, getContractInstance } from '../api/web3';
import productABI from '../../abis/product.abi.json';
import { ServerSideResponse } from '../../interfaces/serverside-response.interface';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export async function getServerSideProps(context_: any) {
  let collectionObject: ServerSideResponse<Collection> = {};

  if (context_.params?.id && context_.req.headers.cookie) {
    collectionObject = await instance
      .get(`/collections/${context_.params.id}`, { headers: { Cookie: context_.req.headers.cookie } })
      .then((response_: AxiosResponse) => {
        if (response_.status === 200) {
          return { data: response_.data };
        }
        return {};
      })
      .catch((error_: AxiosError) => {
        console.log(error_);
        if (error_.response?.status === 401) {
          return { error: 401 };
        }
        return { error: 402 };
      });
  }
  return { props: collectionObject };
}

export default function CollectionDetail(props: ServerSideResponse<Collection>) {
  const { data, error } = props;

  const router = useRouter();

  const [productsState, setProductsState] = useState(data?.products);
  const [progress, setProgress] = useState(false);
  const [step, setStep] = useState(0);
  const [createProductObject, setCreateProductObject] = useState({ name: '', description: '', edition: 1 });
  const [imageFile, setImageFile] = useState<File>();
  const [createProductWarning, setCreateProductWarning] = useState({ name: '', image: '', edition: '' });

  useEffect(() => {
    if (error === 401) {
      router.push('/signin');
    }
  }, []);

  const onTextChange = (event_: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event_.target.name === 'name') {
      setCreateProductWarning({ ...createProductWarning, name: '' });
      setCreateProductObject({ ...createProductObject, name: event_.target.value });
    } else if (event_.target.name === 'description') {
      setCreateProductObject({ ...createProductObject, description: event_.target.value });
    } else {
      setCreateProductWarning({ ...createProductWarning, edition: '' });
      setCreateProductObject({ ...createProductObject, edition: parseInt(event_.target.value) });
    }
  };

  const onFileChange = (event_: React.ChangeEvent<HTMLInputElement>) => {
    if (event_.target.files) {
      setCreateProductWarning({ ...createProductWarning, image: '' });
      setImageFile(event_.target.files[0]);
    }
  };

  const onCreateClick = async () => {
    if (!createProductObject.name) {
      setCreateProductWarning({ ...createProductWarning, name: 'Name is required' });
      return;
    }
    if (!createProductObject.edition) {
      setCreateProductWarning({ ...createProductWarning, name: 'Edition is required' });
      return;
    } else {
      if (createProductObject.edition < 1) {
        setCreateProductWarning({ ...createProductWarning, edition: 'Edition should at least 1' });
        return;
      } else if (createProductObject.edition > 100) {
        setCreateProductWarning({ ...createProductWarning, edition: 'Edition should less than 100' });
        return;
      }
    }
    if (!imageFile?.name) {
      setCreateProductWarning({ ...createProductWarning, image: 'Image is required' });
      return;
    }

    if (data?.id) {
      setProgress(true);
      const _formData = new FormData();
      _formData.append('image', imageFile);
      _formData.append('name', createProductObject.name);
      _formData.append('collectionId', data.id);
      _formData.append('edition', createProductObject.edition.toString());
      if (createProductObject.description) {
        _formData.append('description', createProductObject.description);
      }

      const _product: Product = await instance
        .post('/products', _formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((response_: AxiosResponse) => {
          if (response_.status === 201) {
            return response_.data;
          }
          return null;
        })
        .catch((error_: AxiosError) => {
          console.log('error_', error_);
          return null;
        });

      if (_product && _product.collection?.address && _product.metadata) {
        const _account = await getAccount();
        const _contractInstance: any = await getContractInstance(productABI, _product.collection?.address);

        const _newProduct = await _contractInstance.methods
          .mint(_product.id, createProductObject.edition, _product.metadata, '0x00')
          .send({ from: _account })
          .then((result_: any) => {
            return {
              transactionHash: result_.transactionHash,
              tokenId: result_.events.mintEvent.returnValues.tokenId,
            };
          })
          .catch((error_: any) => {
            console.log('error_', error_.message);
            alert(error_.message);
            return null;
          });

        if (_newProduct && _newProduct.transactionHash && _newProduct.tokenId) {
          await instance
            .patch(`${process.env.NEXT_PUBLIC_API_URL}/products/${_product.id}/sync`, {
              tokenId: _newProduct.tokenId,
              transactionHash: _newProduct.transactionHash,
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
          .get(`/collections/${data?.id}`)
          .then((response_: AxiosResponse) => {
            if (response_.status === 200) {
              console.log(response_.data);
              if (response_.data.products) {
                setProductsState(response_.data.products);
              }
              setStep(0);
            }
          })
          .catch((error_: AxiosError) => {
            console.log('[collection /index] => ', error_);
          });
      }
      setProgress(false);
    }
  };

  const turnToProduct = (productId_: string) => {
    router.push(`/product/${productId_}`);
  };

  return (
    <Container>
      {progress ? (
        <Box width={'100%'} height={'700px'} display={'flex'} justifyContent="center" alignItems={'center'}>
          <CircularProgress />
        </Box>
      ) : (
        <Container style={{ padding: '30px 0' }}>
          <Box mb={10} display="flex">
            <Box ml={3}>
              <Typography>Name: </Typography>
              <Typography>Symbol: </Typography>
              <Typography>Address: </Typography>
              {data?.histories && data.histories[1] && data.histories[1].transactionHash && <Typography>Txn Hash: </Typography>}
            </Box>
            <Box ml={3}>
              <Typography>{data?.name}</Typography>
              <Typography>{data?.symbol}</Typography>
              <Typography>{data?.address}</Typography>
              {data?.histories && data.histories[1] && data.histories[1].transactionHash && (
                <Typography>{data.histories[1].transactionHash}</Typography>
              )}
            </Box>
          </Box>
          {step === 0 ? (
            <Box width="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
              <Grid container columnGap={3} rowGap={3} justifyContent="center">
                {productsState &&
                  productsState.length > 0 &&
                  productsState.map((product_: Product, index_: number) => (
                    <Grid item xs={3} key={`collection_${index_}`} border="solid 1px black" style={{ cursor: 'pointer' }}>
                      <Card
                        onClick={() => {
                          turnToProduct(product_.id);
                        }}
                      >
                        <CardContent>
                          <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
                            Product {index_ + 1}
                          </Typography>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Image width={100} height={100} src={product_.image} alt={`image_${index_}`} />
                          </div>
                          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom mt={1}>
                            name: {product_.name}
                          </Typography>
                          <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                            style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                          >
                            description: {product_.description}
                          </Typography>
                          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            edition: {product_.editions?.length || 1}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
              <Button
                variant="contained"
                onClick={() => {
                  setStep(1);
                }}
                style={{ margin: '30px 0 0 0' }}
              >
                Create Product
              </Button>
            </Box>
          ) : (
            <Container>
              <Box>
                <Box display="flex" flexDirection="column" m="0 auto" maxWidth="500px">
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <label htmlFor="name">
                      name<span style={{ color: 'red' }}>*</span>
                    </label>
                    <Box ml="30px">
                      <TextField
                        error={createProductWarning.name ? true : false}
                        label="name"
                        name="name"
                        type="text"
                        variant="outlined"
                        value={createProductObject.name}
                        onChange={(event_: React.ChangeEvent<HTMLInputElement>) => {
                          onTextChange(event_);
                        }}
                        helperText={createProductWarning.name}
                      />
                    </Box>
                  </Box>
                  <br />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <label htmlFor="description">description</label>
                    <Box ml="30px">
                      <TextareaAutosize
                        name="description"
                        value={createProductObject.description}
                        onChange={(event_: React.ChangeEvent<HTMLTextAreaElement>) => {
                          onTextChange(event_);
                        }}
                        minRows={5}
                        maxRows={10}
                      />
                    </Box>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt="30px">
                    <label htmlFor="name">
                      edition<span style={{ color: 'red' }}>*</span>
                    </label>
                    <Box ml="30px">
                      <TextField
                        error={createProductWarning.edition ? true : false}
                        label="edition"
                        name="edition"
                        type="number"
                        variant="outlined"
                        required
                        value={createProductObject.edition}
                        onChange={(event_: React.ChangeEvent<HTMLInputElement>) => {
                          onTextChange(event_);
                        }}
                        helperText={createProductWarning.edition}
                      />
                    </Box>
                  </Box>
                  <br />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <label htmlFor="description">
                      image<span style={{ color: 'red' }}>*</span>
                    </label>
                    <Box ml="30px">
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        required
                        onChange={(event_: React.ChangeEvent<HTMLInputElement>) => {
                          onFileChange(event_);
                        }}
                      />
                      <Box color="red">{createProductWarning.image}</Box>
                    </Box>
                  </Box>
                  <br />
                  <Box display="flex" justifyContent="center">
                    <Box mr="30px">
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setStep(0);
                        }}
                      >
                        cancel
                      </Button>
                    </Box>
                    <Box>
                      <Button
                        variant="contained"
                        onClick={() => {
                          onCreateClick();
                        }}
                      >
                        Create Product
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Container>
          )}
        </Container>
      )}
    </Container>
  );
}
