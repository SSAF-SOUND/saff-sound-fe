import { css } from '@emotion/react';

import { SelectBox } from '~/components/Common';
import { useMyInfoEditFormContext } from '~/components/Forms/MyInfoEditForm/utils';
import { useTracks } from '~/services/meta';
import { capitalize } from '~/utils';

const fieldName = 'track';

export const Track = () => {
  const { data: tracks } = useTracks();
  const {
    register,
    setValue,
    formState: { defaultValues: { track: defaultTrack } = {} },
  } = useMyInfoEditFormContext();

  const handleChangeTrack = (value: string) => {
    setValue(fieldName, value);
  };

  register(fieldName, {
    required: true,
  });

  return (
    <div css={selfCss}>
      <SelectBox
        focusOnMount
        defaultValue={defaultTrack}
        size="lg"
        items={tracks}
        textAs={(value) => capitalize(value)}
        onValueChange={handleChangeTrack}
      />
    </div>
  );
};

const selfCss = css({});
