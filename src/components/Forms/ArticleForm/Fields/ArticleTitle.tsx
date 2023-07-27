import Editor from '~/components/Editor';
import { useArticleFormContext } from '~/components/Forms/ArticleForm/utils';

const fieldName = 'title';
const validateTitle = (value: string) => {
  if (value.length < 2 || value.length > 100)
    return '제목은 2~100자 사이여야 합니다.';

  return true;
};

export const ArticleTitle = () => {
  const {
    register,
    formState: { defaultValues: { title: defaultTitle } = {} },
  } = useArticleFormContext();

  return (
    <Editor.TitleInput
      defaultValue={defaultTitle}
      {...register(fieldName, {
        validate: validateTitle,
      })}
    />
  );
};