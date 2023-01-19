import styled from '@emotion/styled';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface collection {
  id: string;
  name: string;
  symbol: string;
  user: {
    id: string;
    email: string;
    username: string;
    address: string;
  };
  nfts?: {
    id: string;
    title: string;
    description?: string;
    image: string;
    token_address: string;
    token_id: string;
    creator: {
      id: string;
      email: string;
      username: string;
      address: string;
    };
  }[];
}

export async function getServerSideProps(context_: any) {
  let collectionObject: collection = {} as collection;
  if (context_.params?.id) {
    collectionObject = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/collections/${context_.params.id}`)
      .then((response_: AxiosResponse) => {
        if (response_.status === 200) {
          return response_.data;
        }
      })
      .catch((error_: AxiosError) => {
        return {} as collection;
      });
  }
  return { props: collectionObject };
}

export default function CollectionDetail(props: { id: string; name: string; symbol: string; nfts: any[] }) {
  const { id, name, symbol, nfts } = props;

  const router = useRouter();

  useEffect(() => {
    if (!id) {
      router.push('/collection');
    }
  }, [id, router]);

  return <Container></Container>;
}

const Container = styled.div``;
