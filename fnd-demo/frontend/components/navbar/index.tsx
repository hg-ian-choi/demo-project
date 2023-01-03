// components/navbar/index.tsx

import { useRouter } from 'next/router';
import Image from 'next/image';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { loginUserSelector, setLoginUser } from '../../store/loginUserSlice';
import { useAppDispatch } from '../../store/hooks';

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

export default function Navbar({ signOut }: { signOut: any }) {
  const loginUser = useSelector(loginUserSelector);
  const router = useRouter();

  const turnToSignIn = () => {
    router.push('/signin');
  };

  const turnToSignUp = () => {
    router.push('/signup');
  };

  const turnToSignOut = async () => {
    signOut();
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
          {loginUser.username ? (
            <div>
              Hi, {loginUser.username}
              <span>
                {' '}
                <button onClick={turnToSignOut}>Sign Out</button>
              </span>
            </div>
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
