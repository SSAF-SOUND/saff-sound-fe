import { css } from '@emotion/react';
import { BounceLoader } from 'react-spinners';

import { flex, fontCss, palettes } from '~/styles/utils';

interface DefaultFullPageLoaderProps {
  text?: string;
}

export const DefaultFullPageLoader = (props: DefaultFullPageLoaderProps) => {
  const { text = '' } = props;
  return (
    <div css={selfCss}>
      <BounceLoader color={palettes.white} />
      <p css={textCss}>{text}</p>
    </div>
  );
};

const selfCss = css(
  {
    width: '100%',
    height: '100vh',
  },
  flex('center', 'center', 'column', 20)
);

const textCss = css(fontCss.family.auto);

export const loaderText = {
  checkUser: '유저 정보를 확인중입니다.',
} as const;
