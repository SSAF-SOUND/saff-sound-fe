import type { CustomNextPage } from 'next/types';

import { useRouter } from 'next/router';

import { css } from '@emotion/react';

import { DefaultFullPageLoader } from '~/components/Common';
import { useModal } from '~/components/GlobalModal';
import MyInfoSettings from '~/components/MyInfoSettings';
import TitleBar from '~/components/TitleBar';
import { ProfileVisibilityToggle } from '~/components/Toggles';
import { useSignOut } from '~/services/auth';
import {
  CertificationState,
  useMyInfo,
  useProfileVisibility,
  useUpdateProfileVisibility,
} from '~/services/member';
import {
  flex,
  globalVars,
  pageMinHeight,
  palettes,
  titleBarHeight,
} from '~/styles/utils';
import { EditableMyInfoFields, handleAxiosError, routes } from '~/utils';

const MyInfoSettingsPage: CustomNextPage = () => {
  const { data: myInfo } = useMyInfo();

  const isSsafyMember = !!myInfo?.ssafyMember;
  const isCertified =
    myInfo?.ssafyInfo?.certificationState === CertificationState.CERTIFIED;
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const { mutate: signOut, isLoading: isSigningOut } = useSignOut();

  const handleSignOut = () => {
    signOut(undefined, {
      onSuccess: () => {
        closeModal();
        router.push(routes.main());
      },
      onError: (err) => handleAxiosError(err),
    });
  };

  const openSignOutReconfirmModal = () => {
    openModal('alert', {
      title: '알림',
      description: `${myInfo?.nickname}님 로그아웃 하시겠습니까?`,
      cancelText: '취소',
      actionText: '로그아웃',
      onClickAction: handleSignOut,
      onClickCancel: closeModal,
    });
  };

  return (
    <div css={selfCss}>
      <div>
        <TitleBar.Default
          title="프로필 설정"
          withoutClose
          onClickBackward={routes.profile.self()}
        />

        <nav css={[expandCss, { marginBottom: 40 }]}>
          <MyInfoSettings.NavTitle css={navTitleCss}>
            내 정보
          </MyInfoSettings.NavTitle>

          <MyInfoSettings.NavItem
            href={routes.profile.edit.myInfo(EditableMyInfoFields.NICKNAME)}
          >
            닉네임 수정
          </MyInfoSettings.NavItem>

          <MyInfoSettings.NavItem
            href={routes.profile.edit.myInfo(EditableMyInfoFields.IS_MAJOR)}
          >
            전공자 여부
          </MyInfoSettings.NavItem>

          {isSsafyMember && !isCertified && (
            <MyInfoSettings.NavItem href={routes.certification.student()}>
              SSAFY 인증
            </MyInfoSettings.NavItem>
          )}

          <MyInfoSettings.NavItem
            withStateCss={false}
            withIcon={false}
            asLink={false}
          >
            <span>내 프로필 공개</span>
            <ProfileVisibilityToggleLayer />
          </MyInfoSettings.NavItem>
        </nav>

        <nav css={[expandCss, { marginBottom: 40 }]}>
          <MyInfoSettings.NavTitle css={navTitleCss}>
            SSAFY 정보
          </MyInfoSettings.NavTitle>

          <MyInfoSettings.NavItem
            href={routes.profile.edit.myInfo(
              EditableMyInfoFields.SSAFY_BASIC_INFO
            )}
          >
            SSAFY 기본 정보
          </MyInfoSettings.NavItem>
          {isCertified && (
            <MyInfoSettings.NavItem
              href={routes.profile.edit.myInfo(EditableMyInfoFields.TRACK)}
            >
              SSAFY 트랙
            </MyInfoSettings.NavItem>
          )}
        </nav>
      </div>

      <div css={[expandCss, signOutLayerCss]}>
        <div css={[separatorCss, { marginBottom: 20 }]} />
        <button
          type="button"
          css={signOutButtonCss}
          onClick={openSignOutReconfirmModal}
          disabled={isSigningOut}
        >
          <MyInfoSettings.NavItem asLink={false}>
            로그아웃
          </MyInfoSettings.NavItem>
        </button>
      </div>
    </div>
  );
};

const ProfileVisibilityToggleLayer = () => {
  const { openModal, closeModal } = useModal();
  const { data: profileVisibility } = useProfileVisibility();
  const {
    mutate: updatePortfolioVisibility,
    isLoading: isUpdatingPortfolioVisibility,
  } = useUpdateProfileVisibility();

  const openPrivateProfileAlertModal = () => {
    openModal('alert', {
      title: '알림',
      description: '포트폴리오 및 프로젝트, 스터디 정보가 비공개됩니다.',
      actionText: '확인',
      onClickAction: closeModal,
    });
  };

  const handleToggleProfileVisibility = (isPublic: boolean) => {
    if (!isPublic) {
      openPrivateProfileAlertModal();
    }

    updatePortfolioVisibility(
      { isPublic },
      {
        onError: (err) => {
          handleAxiosError(err);
        },
      }
    );
  };

  return !profileVisibility ? (
    <ProfileVisibilityToggle.Skeleton />
  ) : (
    <ProfileVisibilityToggle
      isPublic={profileVisibility.isPublic}
      disabled={isUpdatingPortfolioVisibility}
      onPressedChange={handleToggleProfileVisibility}
    />
  );
};

export default MyInfoSettingsPage;
MyInfoSettingsPage.auth = {
  role: 'user',
  loading: <DefaultFullPageLoader />,
  unauthorized: routes.unauthorized(),
};

const selfPaddingX = '15px';
const selfPaddingY = `${titleBarHeight + 30}px`;
const totalPaddingX = `calc(${selfPaddingX} + ${globalVars.mainLayoutPaddingX.var})`;
const selfCss = css(
  {
    padding: `${selfPaddingY} ${selfPaddingX}`,
    minHeight: pageMinHeight,
    height: '100vh',
  },
  flex('', '', 'column')
);

const expandCss = css({
  margin: `0 calc(-1 * ${totalPaddingX})`,
});

const separatorCss = css({
  width: 'auto',
  height: 1,
  backgroundColor: palettes.font.blueGrey,
});

const navTitleCss = css({ padding: `0 ${totalPaddingX}` });

const signOutLayerCss = css(
  {
    flexGrow: 1,
  },
  flex('', 'flex-end')
);

const signOutButtonCss = css({
  width: '100%',
  color: palettes.white,
  padding: 0,
  cursor: 'pointer',
  backgroundColor: palettes.background.default,
  transition: 'background-color 200ms',
  ':focus-visible': {
    backgroundColor: palettes.background.grey,
  },
});
