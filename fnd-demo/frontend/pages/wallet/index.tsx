import { Box, Button, Container, Input, TextField } from '@mui/material';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { fromWei, getAccount, getContractInstance, toWei } from '../api/web3';
import fundABI from '../../abis/fund.abi.json';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { loginUserSelector, setLoginUser } from '../../store/loginUserSlice';
import { useAppDispatch } from '../../store/hooks';
import { useRouter } from 'next/router';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export default function Wallet() {
  const router = useRouter();
  const [balance, setBalance] = useState('0');
  const [deposit, setDeposit] = useState('0.01');
  const [withdraw, setWithdraw] = useState('0.01');
  const loginUser = useSelector(loginUserSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (loginUser.wallet) {
      getBalance();
      const custWindow: any = window;
      custWindow.ethereum.on('accountsChanged', function (accounts: string[]) {
        if (accounts[0].toLowerCase() !== loginUser.wallet.toLowerCase()) {
          signOut();
        }
      });
    }
  }, [loginUser]);

  const signOut = async () => {
    await instance
      .post(`/auth/signout`)
      .then((_res: AxiosResponse) => {
        if (_res.status === 201 && _res.data) {
          dispatch(setLoginUser({ userId: '', username: '', wallet: '' }));
          router.push('/');
        }
      })
      .catch((_error: AxiosError) => {
        console.log('_error', _error);
      });
  };

  const getBalance = async () => {
    const account = await getAccount();
    if (account?.toLowerCase() !== loginUser.wallet.toLowerCase()) {
      setBalance('N/A');
      return;
    }
    const contractInstance: any = await getContractInstance(fundABI, `${process.env.NEXT_PUBLIC_CORE}`);
    await contractInstance.methods
      .getBalance()
      .call({ from: account })
      .then((result_: any) => {
        setBalance(fromWei(result_));
      })
      .catch((error_: any) => {
        console.log('error_', error_);
      });
  };

  const onDepositChange = (event_: React.ChangeEvent<HTMLInputElement>) => {
    setDeposit(event_.target.value);
  };

  const onWithdrawChange = (event_: React.ChangeEvent<HTMLInputElement>) => {
    setWithdraw(event_.target.value);
  };

  const onDepositClick = async () => {
    const account = await getAccount();
    if (account?.toLowerCase() !== loginUser.wallet.toLowerCase()) {
      alert('Unverified Wallet address');
      return;
    }
    if (parseFloat(deposit) < 0.01) {
      alert('At least deposit 0.01 Eth');
      return;
    }

    const contractInstance: any = await getContractInstance(fundABI, `${process.env.NEXT_PUBLIC_CORE}`);
    await contractInstance.methods
      .deposit()
      .send({ from: account, value: toWei(deposit) })
      .then((result_: any) => {
        getBalance();
        setDeposit('0.01');
        alert('Successfully deposit');
      })
      .catch((error_: any) => {
        alert('Fail to deposit');
        console.log('error_', error_);
      });
  };

  const onWithdrawClick = async () => {
    const account = await getAccount();
    if (account?.toLowerCase() !== loginUser.wallet.toLowerCase()) {
      alert('Unverified Wallet address');
      return;
    }
    if (parseFloat(withdraw) < 0.01) {
      alert('At least withdraw 0.01 Eth');
      return;
    }
    if (parseFloat(balance) < parseFloat(withdraw)) {
      alert('Not sufficient funds');
      return;
    }

    const contractInstance: any = await getContractInstance(fundABI, `${process.env.NEXT_PUBLIC_CORE}`);
    await contractInstance.methods
      .withdraw(toWei(withdraw))
      .send({ from: account })
      .then((result_: any) => {
        getBalance();
        setWithdraw('0.01');
        alert('Successfully withdraw');
      })
      .catch((error_: any) => {
        alert('Fail to withdraw');
        console.log('error_', error_);
      });
  };

  return (
    <Container>
      <Box mt={10} display={'flex'} flexDirection={'column'} alignItems={'center'}>
        {balance === 'N/A' && (
          <Box color={'red'} mb={10}>
            Unverified Wallet address
          </Box>
        )}
        <Box display={'flex'} justifyContent={'space-between'} minWidth={300}>
          <Box>Balance:</Box>
          <Box>{balance} Eth</Box>
        </Box>
        <Box mt={3} display={'flex'} justifyContent={'space-between'} minWidth={300}>
          <TextField value={deposit} onChange={onDepositChange} />
          <Button onClick={onDepositClick}>deposit</Button>
        </Box>
        <Box mt={3} display={'flex'} justifyContent={'space-between'} minWidth={300}>
          <TextField value={withdraw} onChange={onWithdrawChange} />
          <Button onClick={onWithdrawClick}>withdraw</Button>
        </Box>
      </Box>
    </Container>
  );
}
