// pages/product/[id].tsx

export function getServerSideProps(context: any) {
  if (context.params.id) {
    console.log('context.params.id', context.params.id);
  }
  return { props: {} };
}

export default function ProductDetail(props: {}) {
  return <>Hello, World!</>;
}
