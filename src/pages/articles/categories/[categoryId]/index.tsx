import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next/types';
import type { SearchBarFormProps } from '~/components/Forms/SearchBarForm';
import type { ArticleSummary } from '~/services/article';

import { useRouter } from 'next/router';

import { css } from '@emotion/react';
import { QueryClient } from '@tanstack/react-query';

import { ArticleCard } from '~/components/ArticleCard';
import { BreadCrumbs } from '~/components/BreadCrumbs';
import { CircleButton } from '~/components/Common/CircleButton';
import { PageHead } from '~/components/Common/PageHead';
import { PageHeadingText } from '~/components/Common/PageHeadingText';
import SearchBarForm from '~/components/Forms/SearchBarForm';
import { InfiniteList } from '~/components/InfiniteList';
import EmptyInfiniteList from '~/components/InfiniteList/EmptyInfiniteList';
import NoSearchResults from '~/components/NoSearchResults';
import TitleBar from '~/components/TitleBar';
import { queryKeys } from '~/react-query/common';
import { dehydrate } from '~/react-query/server';
import {
  getArticleCategories,
  getArticles,
  useArticleCategories,
  useArticles,
} from '~/services/article';
import { validateSearchKeyword } from '~/services/common/utils/searchBar';
import { useMyInfo } from '~/services/member';
import {
  flex,
  fontCss,
  globalVars,
  pageCss,
  pageMaxWidth,
  pageMinWidth,
  palettes,
  position,
  titleBarHeight,
} from '~/styles/utils';
import { concat, customToast, routes } from '~/utils';
import { globalMetaData } from '~/utils/metadata';

const createMetaDescription = (categoryName = '게시판') =>
  `${globalMetaData.description} 다양한 주제로 소통할 수 있는 ${categoryName}을 이용해보세요.`;

const ArticleCategoryPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { categoryId } = props;
  const router = useRouter();
  const { keyword } = router.query as QueryString;
  const { data: myInfo } = useMyInfo();
  const isSignedIn = !!myInfo;

  const { data: articleCategories } = useArticleCategories();
  const categoryName =
    articleCategories?.find((category) => category.boardId === categoryId)
      ?.title ?? '게시판';

  const metaDescription = createMetaDescription(categoryName);

  return (
    <>
      <PageHead
        title={categoryName}
        description={metaDescription}
        openGraph={{
          title: categoryName,
          description: metaDescription,
          url: routes.article.category({ categoryId }).pathname,
        }}
      />

      <PageHeadingText text={categoryName} />

      <div css={selfCss}>
        <TitleBar.Default
          css={fontCss.style.B16}
          title={categoryName}
          withoutClose
          footer={
            <BreadCrumbs
              entries={[
                { name: '게시판 목록', link: routes.article.categories() },
                {
                  name: categoryName,
                  link: routes.article.category({ categoryId }),
                  active: true,
                },
              ]}
            />
          }
        />

        <SearchBar categoryId={categoryId} />

        <div css={articleContainerCss}>
          <ArticleLayer categoryId={categoryId} keyword={keyword} />
        </div>

        {isSignedIn && (
          <div css={fabContainerCss}>
            <CircleButton
              css={fabCss}
              name="pencil.plus"
              label="게시글 작성 버튼"
              asLink
              href={routes.article.create({ categoryId })}
            />
          </div>
        )}
      </div>
    </>
  );
};

interface ArticleLayerProps {
  categoryId: number;
  keyword?: string;
}

const ArticleLayer = (props: ArticleLayerProps) => {
  const { categoryId, keyword } = props;
  const isValidKeyword = validateSearchKeyword(keyword);
  const articlesInfiniteQuery = useArticles(categoryId, { keyword });

  const infiniteData = articlesInfiniteQuery.data
    ? articlesInfiniteQuery.data.pages.map(({ posts }) => posts).reduce(concat)
    : ([] as ArticleSummary[]);

  return (
    <InfiniteList
      data={infiniteData}
      infiniteQuery={articlesInfiniteQuery}
      skeleton={<ArticleCard.Skeleton />}
      skeletonCount={6}
      useWindowScroll={true}
      skeletonGap={16}
      itemContent={(index, article) => <ArticleCard article={article} />}
      emptyElement={
        isValidKeyword ? (
          <NoSearchResults keyword={keyword} />
        ) : (
          <EmptyInfiniteList text="아직 게시글이 없습니다." />
        )
      }
    />
  );
};

interface SearchBarProps {
  categoryId: number;
}

const SearchBar = (props: SearchBarProps) => {
  const { categoryId } = props;
  const router = useRouter();
  const { keyword: queryKeyword } = router.query as QueryString;
  const isValidKeyword = validateSearchKeyword(queryKeyword);
  const defaultKeyword = isValidKeyword ? queryKeyword : '';

  const onValidSubmit: SearchBarFormProps['onValidSubmit'] = async (
    reset,
    formValues
  ) => {
    const { keyword } = formValues;
    if (keyword === queryKeyword) {
      return;
    }
    reset({ keyword });
    router.push(routes.article.category({ categoryId, keyword }));
  };

  const onInvalidSubmit: SearchBarFormProps['onInvalidSubmit'] = (
    errorMessage
  ) => {
    if (errorMessage) {
      customToast.clientError(errorMessage);
    }
  };

  return (
    <SearchBarForm
      css={searchBarContainerCss}
      onValidSubmit={onValidSubmit}
      onInvalidSubmit={onInvalidSubmit}
      defaultValues={{
        keyword: defaultKeyword,
      }}
      options={{ allowEmptyString: true }}
    />
  );
};

export default ArticleCategoryPage;

/* css */

const breadCrumbsHeight = 32;
const searchBarTop = titleBarHeight + breadCrumbsHeight;
const searchBarContainerHeight = 72;
const selfPaddingTop = searchBarTop + searchBarContainerHeight;

// `Skeleton`의 `zIndex`는 1
const fixedLayoutZIndex = 10;
const fabZIndex = 30;

const selfCss = css(
  { padding: `${selfPaddingTop}px 0 15px` },
  pageCss.minHeight,
  flex('', '', 'column')
);

const searchBarContainerCss = css(
  {
    width: '100%',
    minWidth: pageMinWidth,
    maxWidth: pageMaxWidth,
    padding: `8px ${globalVars.mainLayoutPaddingX.var} 0`,
    height: searchBarContainerHeight,
    top: searchBarTop,
    zIndex: fixedLayoutZIndex,
    backgroundColor: palettes.background.default,
  },
  position.x('center', 'fixed')
);

const articleContainerCss = css({
  position: 'relative',
  width: '100%',
  height: '100%',
  flexGrow: 1,
  marginTop: 4,
});

const fabContainerCss = css(flex('center', 'flex-end', 'row'));

const fabCss = css({ position: 'fixed', bottom: 40, zIndex: fabZIndex });

/* ssr */

interface Props {
  categoryId: number;
}

// `interface`로 작성하면, `GetServerSideProps`의 Generic에 할당이 안되어서, type으로 작성
type Params = {
  categoryId: string;
};

type QueryString = Partial<{
  keyword: string;
}>;

export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  const categoryId = Number(context.params?.categoryId);
  const isValidCategoryId = !Number.isNaN(categoryId);

  const { keyword: queryKeyword } = context.query as QueryString;
  const isValidKeyword = validateSearchKeyword(queryKeyword);
  const keyword = isValidKeyword ? queryKeyword?.trim() : undefined;

  if (!isValidCategoryId) {
    return {
      notFound: true,
    };
  }

  /* prefetch start */
  const queryClient = new QueryClient();
  const articleListQueryKey = queryKeys.articles.list(categoryId, keyword);
  const articleCategoriesQueryKey = queryKeys.articles.categories();

  await Promise.allSettled([
    queryClient.prefetchInfiniteQuery({
      queryKey: articleListQueryKey,
      queryFn: () =>
        getArticles({
          categoryId,
          keyword: keyword,
        }),
    }),
    queryClient.prefetchQuery({
      queryKey: articleCategoriesQueryKey,
      queryFn: getArticleCategories,
    }),
  ]);

  const { dehydratedState } = dehydrate(queryClient);
  dehydratedState.queries.forEach((query) => {
    // https://github.com/TanStack/query/issues/1458#issuecomment-1022396964
    // eslint-disable-next-line
    // @ts-ignore
    if ('pageParams' in query.state.data) {
      query.state.data.pageParams = [null];
    }
  });

  /* prefetch end */

  return {
    props: {
      dehydratedState,
      categoryId,
    },
  };
};
