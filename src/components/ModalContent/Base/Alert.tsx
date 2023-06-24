import type { ReactNode } from 'react';
import type { AnyFunction } from '~/types';

import { css } from '@emotion/react';

import { Modal } from '~/components/Common';
import { flex, fontCss, palettes } from '~/styles/utils';
import { position } from '~/styles/utils/position';

interface AlertProps {
  title?: ReactNode;
  description?: ReactNode;
  actionText?: string;
  cancelText?: string;
  onClickAction?: AnyFunction;
  onClickCancel?: AnyFunction;
}

const Alert = (props: AlertProps) => {
  const {
    title,
    description,
    actionText,
    cancelText,
    onClickCancel,
    onClickAction,
  } = props;
  return (
    <div css={selfCss}>
      <div css={descriptionCss}>
        {title && <Modal.Title>{title}</Modal.Title>}
        {description && <Modal.Description>{description}</Modal.Description>}
      </div>
      <div css={buttonGroupCss}>
        {cancelText && (
          <Modal.Close
            onClick={onClickCancel}
            css={[buttonCss, fontCss.style.R16]}
          >
            {cancelText}
          </Modal.Close>
        )}
        {actionText && (
          <Modal.Close
            onClick={onClickAction}
            css={[buttonCss, fontCss.style.B16]}
          >
            {actionText}
          </Modal.Close>
        )}
      </div>
    </div>
  );
};

export default Alert;

const selfCss = css(
  {
    backgroundColor: palettes.white,
    minWidth: 280,
    borderRadius: 16,
  },
  position.xy('center', 'center', 'fixed'),
  fontCss.family.auto
);

const descriptionCss = css(
  {
    padding: 18,
    color: palettes.black,
  },
  flex('center', 'center')
);

const buttonGroupCss = css(flex('center', '', 'row'), {
  borderTop: `0.5px solid ${palettes.background.grey}`,
  '& > button + button': {
    borderLeft: `1px solid ${palettes.background.grey}`,
  },
});

const buttonCss = css({
  cursor: 'pointer',
  minHeight: 44,
  outline: 0,
  border: 0,
  backgroundColor: 'transparent',
  width: '100%',
  color: palettes.primary.darken,
  ':hover': {
    color: palettes.primary.dark,
  },
  ':active': {
    color: palettes.primary.default,
  },
  ':focus-visible': {
    outline: `2px solid ${palettes.primary.darken}`,
  },
});
