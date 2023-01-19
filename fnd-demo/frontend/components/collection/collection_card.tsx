import styled from '@emotion/styled';

const Container = styled.div`
  border: solid 1px black;
  cursor: pointer;
`;

export default function CollectionCard(props: any) {
  const { collectionName, collectionSymbol } = props;
  return (
    <Container>
      <div>{collectionName}</div>
      <div>{collectionSymbol}</div>
    </Container>
  );
}
