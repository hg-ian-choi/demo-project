import styled from '@emotion/styled';
import axios, { AxiosResponse } from 'axios';

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

export async function getServerSideProps(context: any) {
  const collections = await instance.get('/collections/user', { headers: { Cookie: context.req.headers.cookie } }).then((res_: AxiosResponse) => {
    return res_.data;
  });
  return {
    props: { collections },
  };
}

export default function Create(props: any) {
  const { collections } = props;
  console.log('collections', collections);
  return (
    <Container>
      {collections ? collections.map((value_: any, index_: number) => <></>) : <div>
        </div>}
    </Container>
  );
}
