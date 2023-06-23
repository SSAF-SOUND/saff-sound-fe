import type { CustomNextPage } from 'next/types';

import { useRouter } from 'next/router';

import DefaultFullPageLoader from '~/components/Common/DefaultFullPageLoader';
import UserRegister from '~/components/UserRegister';
import { useMyAccountStatus } from '~/services/member';

const RegisterPage: CustomNextPage = () => {
  const router = useRouter();
  const { isRegisterRequired } = useMyAccountStatus();

  if (!isRegisterRequired) {
    router.replace('/main');
  }

  return <UserRegister />;
};

RegisterPage.auth = {
  role: 'user',
  loading: <DefaultFullPageLoader text="유저 정보를 확인하는 중입니다." />,
  unauthorized: '/main',
};

export default RegisterPage;
