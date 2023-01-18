import styled from '@emotion/styled';
import { Button, TextField } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { getAccount, getContractInstance } from '../api/web3/web3';
import { loginUserSelector } from '../../store/loginUserSlice';
import abi from '../../abis/CloneAbi.json';

const instance = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SignInDiv = styled.div`
  min-width: 300px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
`;

const InputDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export async function getServerSideProps(context: any) {
  let collections: any = [];
  if (context.req.headers.cookie) {
    collections = await instance.get('/collections/user', { headers: { Cookie: context.req.headers.cookie } }).then((res_: AxiosResponse) => {
      return res_.data;
    });
  }
  return {
    props: { collections },
  };
}

export default function Create(props: any) {
  const { collections } = props;

  const router = useRouter();
  const loginUser = useSelector(loginUserSelector);

  const [step, setStep] = useState(0);
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
    if (!account) return;

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

    const contractInstance = await getContractInstance(abi, `${process.env.NEXT_PUBLIC_CLONE_CONTRACT_ADDRESS}`);

    if (!contractInstance) return;

    const newClone = await contractInstance.methods
      .uri(1)
      .call()
      .then((result_: any) => {
        console.log('result_', result_);
        return result_;
      });

    if (!newClone) {
      alert('Something went wrong when Create Collection');
      return;
    }
  };

  return (
    <Container>
      {collections.length > 0 ? (
        collections.map((value_: any, index_: number) => <></>)
      ) : (
        <div>
          <div>
            {step === 0 ? (
              <Button
                variant="contained"
                onClick={() => {
                  nextStep(1);
                }}
              >
                Create Collection
              </Button>
            ) : step === 1 ? (
              <div>
                <SignInDiv>
                  <InputDiv>
                    <label htmlFor="name">name</label>
                    <div>
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
                  </InputDiv>
                  <br />
                  <InputDiv>
                    <label htmlFor="symbol">symbol</label>
                    <div>
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
                  </InputDiv>
                  <br />
                  <Button variant="contained" onClick={createCollection}>
                    Create Collection
                  </Button>
                </SignInDiv>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </Container>
  );
}
