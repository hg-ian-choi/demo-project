import styled from '@emotion/styled';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { collection } from '../../interfaces/collection.interface';

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

export default function CollectionDetail(props: collection) {
  const { id, name, symbol, user, products } = props;

  const router = useRouter();

  useEffect(() => {
    if (!id) {
      router.push('/collection');
    }
  }, [id, router]);

  return <Container></Container>;
}

const Container = styled.div``;
