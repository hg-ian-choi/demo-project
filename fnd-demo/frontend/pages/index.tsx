// pages/index.tsx

import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { loginUserSelector } from '../store/loginUserSlice';
import Web3 from 'web3';
import { Button } from '@mui/material';
import { getAccount, getContractInstance } from './api/web3';
import abi from '../abis/Fund.json';

export default function Home() {
  const loginUser = useSelector(loginUserSelector);

  const getEvent = async () => {
    const contractInstance: any = await getContractInstance(abi, '0x23C1E17456645827d29444ebE788cE06C5407265');
    if (!contractInstance) throw new Error('ContractInstance Error');
    const balance = await contractInstance.methods.getFundBalance().call();
    const account = (await getAccount()) || '';
    const events = await contractInstance
      .getPastEvents('depositEvent', {
        filter: { operator: account },
        // topics: [, Web3.utils.sha3('a7ebf019-4516-4b85-ad15-d66bf2eed39a'), Web3.utils.padLeft(account, 64)],
        fromBlock: 0,
        toBlock: 'latest',
      })
      .then((events: any) => events)
      .catch((error: any) => {
        console.log('error', error);
      });
    console.log('events', events);
  };
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component="h6" gutterBottom>
          {loginUser.username ? `Welcome, ${loginUser.username}!` : 'Hello, World!'}
        </Typography>
        <Button onClick={getEvent}>getEvent</Button>
      </Box>
    </Container>
  );
}
