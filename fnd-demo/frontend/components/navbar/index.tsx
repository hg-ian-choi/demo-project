// components/navbar/index.tsx

import { useRouter } from 'next/router';
import Image from 'next/image';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { loginUserSelector } from '../../store/loginUserSlice';

const Container = styled.div`
  position: fixed;
  width: 100vw;
  height: auto;
  background-color: lightgray;
`;
const SubContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 30px;
`;
const ImageWrap = styled.div`
  cursor: pointer;
`;
const ProfileContainer = styled.div``;
const ButtonWrap = styled.div``;

export default function Navbar() {
  const user = useSelector(loginUserSelector);
  const router = useRouter();

  const turnToSignIn = () => {
    router.push('/signin');
  };

  const turnToSignUp = () => {
    router.push('/signup');
  };

  return (
    <Container>
      <SubContainer>
        <ImageWrap>
          <Image
            src={'/favicon.ico'}
            width={50}
            height={50}
            alt={'favicon'}
            onClick={() => {
              router.push('/');
            }}
          />
        </ImageWrap>
        <ProfileContainer>
          {user.username ? (
            <div>Hi, {user.username}</div>
          ) : (
            <ButtonWrap>
              <button onClick={turnToSignIn}>Sign In</button>
              <span> </span>
              <button onClick={turnToSignUp}>Sign Up</button>
            </ButtonWrap>
          )}
        </ProfileContainer>
      </SubContainer>
    </Container>
  );
}
