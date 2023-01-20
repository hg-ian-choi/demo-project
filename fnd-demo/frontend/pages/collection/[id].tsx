import styled from '@emotion/styled';
import { Button, Card, CardContent, Container, FilledInput, Grid, Input, TextareaAutosize, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { collection } from '../../interfaces/collection.interface';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export async function getServerSideProps(context_: any) {
  let collectionObject: collection = {} as collection;

  if (context_.params?.id) {
    collectionObject = await instance
      .get(`/collections/${context_.params.id}`)
      .then((response_: AxiosResponse) => {
        if (response_.status === 200) {
          return response_.data;
        }
      })
      .catch((error_: AxiosError) => {
        console.log('error_', error_);
        return {} as collection;
      });
  }
  return { props: collectionObject };
}

export default function CollectionDetail(props: collection) {
  const { id, name, symbol, address, user, products } = props;

  const router = useRouter();

  const [step, setStep] = useState(0);
  const [createProductObject, setCreateProductObject] = useState({ name: '', description: '' });
  const [imageFile, setImageFile] = useState<File>();
  const [createProductWarning, setCreateProductWarning] = useState({ name: '', image: '' });

  useEffect(() => {
    if (!id) {
      router.push('/collection');
    }
  }, [id, router]);

  const onTextChange = (event_: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event_.target.name === 'name') {
      setCreateProductWarning({ ...createProductWarning, name: '' });
      setCreateProductObject({ ...createProductObject, name: event_.target.value });
    } else {
      setCreateProductObject({ ...createProductObject, description: event_.target.value });
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
    if (!imageFile?.name) {
      setCreateProductWarning({ ...createProductWarning, image: 'Image is required' });
      return;
    }

    const _formData = new FormData();
    _formData.append('image', imageFile);
    _formData.append('name', createProductObject.name);
    if (createProductObject.description) {
      _formData.append('description', createProductObject.description);
    }

    await instance
      .post('/products', _formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((response_: AxiosResponse) => {
        console.log('response_.status', response_.status);
        console.log('response_.data', response_.data);
      })
      .catch((error_: AxiosError) => {
        console.log('error_.code', error_.code);
        console.log('error_', error_);
      });
  };

  return (
    <Container style={{ padding: '30px 0' }}>
      <Box mb={10} display="flex">
        <Box ml={3}>
          <Typography>Name: </Typography>
          <Typography>Symbol: </Typography>
          <Typography>Contract address: </Typography>
        </Box>
        <Box ml={3}>
          <Typography>{name}</Typography>
          <Typography>{symbol}</Typography>
          <Typography>{address}</Typography>
        </Box>
      </Box>
      {step === 0 ? (
        <Box width="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Grid container columnGap={3} rowGap={3} justifyContent="center">
            {products.length > 0 &&
              products.map((value_: any, index_: number) => (
                <Grid item xs={3} key={`collection_${index_}`} border="solid 1px black" style={{ cursor: 'pointer' }}>
                  <Card onClick={() => {}}>
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
                    label="name"
                    name="name"
                    type="text"
                    variant="outlined"
                    value={createProductObject.name}
                    onChange={(event_: React.ChangeEvent<HTMLInputElement>) => {
                      onTextChange(event_);
                    }}
                  />
                  <Box color="red">{createProductWarning.name}</Box>
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
  );
}
