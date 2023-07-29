import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next/types';
import type { ArticleDetail, ArticleDetailError } from '~/services/article';

import { css } from '@emotion/react';

import { Article } from '~/components/Article';
import RedirectionGuide from '~/components/RedirectionGuide';
import TitleBar from '~/components/TitleBar';
import { queryKeys } from '~/react-query/common';
import { prefetch } from '~/react-query/server';
import { getArticleDetail, useArticleDetail } from '~/services/article';
import { globalVars, palettes, titleBarHeight } from '~/styles/utils';
import { routes } from '~/utils';

interface ArticleDetailPageProps
  extends InferGetServerSidePropsType<typeof getServerSideProps> {}

const ArticleDetailPage = (props: ArticleDetailPageProps) => {
  const { initialArticleDetail, articleId } = props;
  const { data: articleDetail } = useArticleDetail(articleId, {
    initialData: initialArticleDetail ?? undefined,
  });

  if (!articleDetail) {
    return (
      <RedirectionGuide
        title="Error"
        description="게시글을 불러오는데 실패했습니다."
        redirectionText="게시글 모아보기 페이지로"
        redirectionTo={routes.articles.categories()}
      />
    );
  }

  if ('error' in articleDetail) {
    return <>에러 페이지</>;
  }

  const { title: categoryTitle, boardId: articleCategoryId } =
    articleDetail.category;

  return (
    <div css={selfCss}>
      <TitleBar.Default
        title={categoryTitle}
        withoutClose
        onClickBackward={routes.articles.category(articleCategoryId)}
      />

      <Article css={[articleCss, expandCss]} articleDetail={articleDetail} />
    </div>
  );
};

export default ArticleDetailPage;

/* css */

const selfPaddingX = 0;
const negativeMarginForExpand = `calc(-1 * (${selfPaddingX}px + ${globalVars.mainLayoutPaddingX.var}))`;

const selfCss = css({
  padding: `${titleBarHeight + 10}px ${selfPaddingX}px`,
});

const expandCss = css({
  width: 'auto',
  margin: `0 ${negativeMarginForExpand}`,
});

const articleCss = css({
  padding: '20px 24px',
  backgroundColor: palettes.background.grey,
});

/* ssr */

interface Props {
  initialArticleDetail: null | ArticleDetail | ArticleDetailError;
  articleId: number;
}

type Params = {
  articleId: string;
};

export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  const articleId = Number(context.params?.articleId);

  // 0. articleId가 유효하지 않음 (숫자가 아님) -> notFound
  // 1. 클라이언트 오류 (없는 게시글, 삭제된 게시글을 조회할 때)
  // 2. 서버 오류

  if (Number.isNaN(articleId)) {
    return {
      notFound: true,
    };
  }

  const dehydrate = prefetch({
    queryKey: queryKeys.article.detail(articleId),
    queryFn: () => getArticleDetail(articleId),
  });

  const dehydratedState = await dehydrate();

  const initialArticleDetail =
    (dehydratedState.queries[0]?.state?.data as
      | ArticleDetail
      | ArticleDetailError
      | undefined) ?? null;

  return {
    props: {
      articleId,
      initialArticleDetail,
      dehydratedState,
    },
  };
};
