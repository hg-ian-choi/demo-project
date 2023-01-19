import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export async function getServerSideProps(context_: any) {
  let collection: { id: string; name: string; symbol: string } = { id: '', name: '', symbol: '' };
  if (context_.params?.id) {
    collection = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/collections/${context_.params.id}`)
      .then((response_: AxiosResponse) => {
        if (response_.status === 200) {
          console.log('response_.data', response_.data);
          return response_.data;
        }
      })
      .catch((error_: AxiosError) => {
        return { id: '', name: '', symbol: '' };
      });
  }
  return { props: collection };
}

export default function CollectionDetail(props: { collection: { id: string; name: string; symbol: string } }) {
  const { collection } = props;
  const router = useRouter();

  useEffect(() => {
    if (!collection?.id) {
      // router.push('/collection');
    }
  }, [collection]);

  return <div>Hello, World!</div>;
}
