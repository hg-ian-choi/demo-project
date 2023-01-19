import styled from '@emotion/styled';
import { useRouter } from 'next/router';

const Container = styled.div`
  border: solid 1px black;
  text-align: center;
  cursor: pointer;
`;

export default function CollectionCard(props: any) {
  const { collectionId, collectionName, collectionSymbol, num } = props;
  const router = useRouter();

  const turnToDetail = (id_: string) => {
    router.push(`/collection/${id_}`);
  };

  return (
    <Container
      onClick={() => {
        turnToDetail(collectionId);
      }}
    >
      <div>Collection - {num + 1}</div>
      <div>name: {collectionName}</div>
      <div>symbol: {collectionSymbol}</div>
    </Container>
  );
}
