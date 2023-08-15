import Link from 'next/link';
import { useRouter } from 'next/router';

import { css } from '@emotion/react';

import { Button } from '~/components/Common';
import TitleBar from '~/components/TitleBar';
import { useDeleteAccount } from '~/services/auth';
import { flex, fontCss, pageMinHeight, titleBarHeight } from '~/styles/utils';
import { customToast, handleAxiosError, routes } from '~/utils';

const DeleteAccountPage = () => {
  const router = useRouter();
  const { mutateAsync: deleteAccount, isLoading: isDeletingAccount } =
    useDeleteAccount();

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      router.replace(routes.main());
      customToast.success('회원 탈퇴가 완료되었습니다.');
    } catch (err) {
      handleAxiosError(err);
    }
  };

  return (
    <div css={selfCss}>
      <TitleBar.Default
        title="회원탈퇴"
        withoutClose
        onClickBackward={routes.profile.myInfoSettings()}
      />
      <div css={descriptionCss}>
        <p>탈퇴 하시겠습니까?</p>
        {/*<p>이용 약관</p>*/}
      </div>
      <div css={buttonLayerCss}>
        <Button size="lg" variant="inverse" css={buttonCss} asChild>
          <Link href={routes.profile.myInfoSettings()}>아니오</Link>
        </Button>
        <Button
          size="lg"
          loading={isDeletingAccount}
          css={buttonCss}
          onClick={handleDeleteAccount}
        >
          네
        </Button>
      </div>
    </div>
  );
};

export default DeleteAccountPage;

const selfCss = css(
  {
    padding: `${titleBarHeight}px 0`,
    minHeight: `max(${pageMinHeight}px, 100vh)`,
  },
  flex('', '', 'column')
);
const descriptionCss = css(
  { flexGrow: 1 },
  flex('center', 'center'),
  fontCss.style.R16
);
const buttonCss = css({ width: '50%' });
const buttonLayerCss = css(flex('center', 'stretch', 'row', 16));