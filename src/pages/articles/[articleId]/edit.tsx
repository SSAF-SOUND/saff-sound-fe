import type { CustomNextPage } from 'next/types';
import type { ArticleFormProps } from '~/components/Forms/ArticleForm';

import { useRouter } from 'next/router';

import { ArticleError } from '~/components/Article/ArticleError';
import { FullPageLoader, PageHeadingText } from '~/components/Common';
import ArticleForm from '~/components/Forms/ArticleForm';
import { useArticleDetail, useUpdateArticle } from '~/services/article';
import {
  createAuthGuard,
  createNoIndexPageMetaData,
  handleAxiosError,
  routes,
} from '~/utils';

const metaTitle = '게시글 수정';

const ArticleEditPage: CustomNextPage = () => {
  const router = useRouter();
  const query = router.query as { articleId: string };
  const articleId = Number(query.articleId);
  const {
    data: articleDetail,
    isLoading: isArticleDetailLoading,
    isError: isArticleDetailError,
    error: articleDetailError,
  } = useArticleDetail(articleId);
  const { mutateAsync: updateArticle } = useUpdateArticle(articleId);

  if (isArticleDetailLoading) {
    return <FullPageLoader text="데이터를 불러오는 중입니다." />;
  }

  if (isArticleDetailError) {
    return <ArticleError error={articleDetailError} />;
  }

  const { mine, title, content, images, anonymity } = articleDetail;

  if (!mine) {
    router.replace(routes.unauthorized());
    return <FullPageLoader />;
  }

  const onValidSubmit: ArticleFormProps['onValidSubmit'] = async (
    formValues
  ) => {
    try {
      await updateArticle(formValues);
      await router.push(routes.article.detail(articleId));
    } catch (err) {
      handleAxiosError(err);
    }
  };

  return (
    <>
      <PageHeadingText text={metaTitle} />

      <div>
        <ArticleForm
          onValidSubmit={onValidSubmit}
          options={{
            titleBarText: '게시글 수정',
            titleBarCloseRoute: routes.article.detail(articleId),
          }}
          defaultValues={{
            title,
            content,
            images,
            anonymous: anonymity,
          }}
        />
      </div>
    </>
  );
};

export default ArticleEditPage;
ArticleEditPage.auth = createAuthGuard();
ArticleEditPage.meta = createNoIndexPageMetaData(metaTitle);
