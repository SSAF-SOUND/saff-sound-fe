import type { MyInfoEditFormValues } from './utils';
import type {
  SubmitErrorHandler,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';
import type { PartialDeep } from 'type-fest';

import { css } from '@emotion/react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '~/components/Common';
import { Nickname } from '~/components/Forms/UserRegisterForm/Fields';
import TitleBar from '~/components/TitleBar';
import { flex, pageMinHeight } from '~/styles/utils';

import { SsafyBasicInfo, IsMajor, Track } from './Fields';

type MyInfoEditFormFields = keyof MyInfoEditFormValues;

const titleMap: Record<MyInfoEditFormFields, string> = {
  nickname: '닉네임 수정',
  isMajor: 'SSAFY 전공자',
  ssafyBasicInfo: 'SSAFY 기본정보',
  track: 'SSAFY 트랙',
};

interface MyInfoEditFormPropsOptions {
  forceSsafyMemberToTrue: boolean;
  titleBarBackwardRoute: string;
}

type OriginalOnValidSubmit = SubmitHandler<MyInfoEditFormValues>;
type OnValidSubmit = OriginalOnValidSubmit extends (
  ...args: infer Args
) => infer Return
  ? (
      reset: UseFormReturn<MyInfoEditFormValues>['reset'],
      ...args: Args
    ) => Return
  : never;

export interface MyInfoEditFormProps {
  field: MyInfoEditFormFields;
  defaultValues: PartialDeep<MyInfoEditFormValues>;
  onValidSubmit: OnValidSubmit;
  onInvalidSubmit?: SubmitErrorHandler<MyInfoEditFormValues>;
  className?: string;
  options?: Partial<MyInfoEditFormPropsOptions>;
}

const MyInfoEditForm = (props: MyInfoEditFormProps) => {
  const {
    field,
    defaultValues,
    onValidSubmit,
    onInvalidSubmit,
    className,
    options: { forceSsafyMemberToTrue, titleBarBackwardRoute } = {},
  } = props;

  const methods = useForm<MyInfoEditFormValues>({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isDirty, isSubmitting },
    reset,
  } = methods;

  const handleValidSubmit: OriginalOnValidSubmit = async (value, event) => {
    await onValidSubmit(reset, value, event);
  };

  return (
    <FormProvider {...methods}>
      <form
        css={selfCss}
        className={className}
        onSubmit={handleSubmit(handleValidSubmit, onInvalidSubmit)}
      >
        <TitleBar.Default
          title={titleMap[field]}
          backwardAs={titleBarBackwardRoute}
          withoutClose
        />
        {field === 'nickname' && (
          <Nickname
            buttonText="수정 완료"
            initialNickname={defaultValues.nickname}
            withLabelText={false}
          />
        )}
        {field === 'ssafyBasicInfo' && (
          <SsafyBasicInfo forceSsafyMemberToTrue={forceSsafyMemberToTrue} />
        )}
        {field === 'isMajor' && <IsMajor />}
        {field === 'track' && <Track />}

        {field !== 'nickname' && (
          <Button
            size="lg"
            type="submit"
            disabled={!isDirty}
            loading={isSubmitting}
          >
            수정 완료
          </Button>
        )}
      </form>
    </FormProvider>
  );
};

export default MyInfoEditForm;

const selfCss = css(
  {
    minHeight: pageMinHeight,
  },
  flex('', 'space-between')
);
