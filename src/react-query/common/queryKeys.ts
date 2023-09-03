import type { LunchDateSpecifier } from '~/services/lunch';

export const queryKeys = {
  auth: () => ['auth'],
  user: {
    myInfo: () => [...queryKeys.auth(), 'myInfo'],
    userInfo: (id: number) => ['userInfo', id],
    myPortfolio: () => [...queryKeys.auth(), 'portfolio'],
    portfolio: (id: number) => ['portfolio', id],
    profileVisibility: () => ['profileVisibility', 'mine'],
    userProfileVisibility: (id: number) => ['profileVisibility', id],
  },
  meta: {
    self: () => ['meta'],
    campuses: () => [...queryKeys.meta.self(), 'campuses'],
    recruitTypes: () => [...queryKeys.meta.self(), 'recruitTypes'],
  },
  articles: {
    categories: () => ['articles', 'categories'],
    list: (categoryId: number, searchKeyword?: string) => [
      'articles',
      'category',
      categoryId,
      searchKeyword ?? null,
    ],
    hot: (searchKeyword?: string) => ['articles', 'hot', searchKeyword ?? null],
    detail: (articleId: number) => ['articles', articleId],
    mine: () => [...queryKeys.auth(), 'articles'],
  },
  articleComments: {
    list: (articleId: number) => ['comments', articleId],
  },
  recruitComments: {
    list: (recruitId: number) => ['recruit-comments', recruitId],
  },
  recruit: {
    list: () => ['recruits'],
    detail: (recruitId: number) => ['recruits', 'detail', recruitId],
    members: (recruitId: number) => ['recruits', 'members', recruitId],
    scrap: (recruitId: number) => ['recruits', 'scrap', recruitId],
    apply: (recruitId: number) => ['recruits', 'apply', recruitId],
    applicants: (recruitId: number) => [
      ...queryKeys.auth(),
      'recruits',
      recruitId,
      'applicants',
    ],
  },
  lunch: {
    self: () => [...queryKeys.auth(), 'lunch'],
    list: ({
      campus,
      dateSpecifier,
    }: {
      campus: string;
      dateSpecifier: LunchDateSpecifier;
    }) => [...queryKeys.lunch.self(), campus, dateSpecifier],
  },
};

export const endpoints = {
  auth: {
    provider: (provider: string) => `/auth/${provider}` as const,
    signIn: () => '/auth/callback' as const,
    signOut: () => '/auth/logout' as const,
    refresh: () => '/auth/reissue' as const,
  },
  s3: {
    preSignedUrl: () => `/store/image`,
  },
  articles: {
    categories: () => '/boards' as const,
    list: (params: {
      categoryId: number;
      cursor: number;
      size: number;
      keyword?: string;
    }) => {
      const { categoryId: boardId, size, cursor, keyword = '' } = params;

      if (keyword) {
        // https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1568
        const queryString = new URLSearchParams({
          boardId,
          size,
          cursor,
          keyword,
        } as never).toString();
        return `/posts/search?${queryString}` as const;
      }

      const queryString = new URLSearchParams({
        boardId,
        size,
        cursor,
      } as never).toString();

      return `/posts?${queryString}` as const;
    },
    hot: (params: { cursor: number; size: number; keyword?: string }) => {
      const { size, cursor, keyword = '' } = params;

      if (keyword) {
        const queryString = new URLSearchParams({
          size,
          cursor,
          keyword,
        } as never).toString();
        return `/posts/hot/search?${queryString}` as const;
      }

      const queryString = new URLSearchParams({
        size,
        cursor,
      } as never).toString();

      return `/posts/hot?${queryString}` as const;
    },
    mine: (params: { cursor: number; size: number }) => {
      const queryString = new URLSearchParams(params as never).toString();
      return `/posts/my?${queryString}` as const;
    },
    create: (categoryId: number) => `/posts?boardId=${categoryId}` as const,
    detail: (articleId: number) => `/posts/${articleId}` as const,
    report: (articleId: number) =>
      `${endpoints.articles.detail(articleId)}/report` as const,
    like: (articleId: number) =>
      `${endpoints.articles.detail(articleId)}/like` as const,
    scrap: (articleId: number) =>
      `${endpoints.articles.detail(articleId)}/scrap` as const,
  },
  articleComments: {
    detail: (commentId: number) => `/comments/${commentId}` as const,
    list: (articleId: number) => `/comments?postId=${articleId}` as const,
    create: (articleId: number) => `/comments?postId=${articleId}` as const,
    like: (commentId: number) =>
      `${endpoints.articleComments.detail(commentId)}/like` as const,
    report: (commentId: number) =>
      `${endpoints.articleComments.detail(commentId)}/report` as const,
    reply: (params: { articleId: number; commentId: number }) => {
      const { commentId, articleId } = params;
      const queryString = new URLSearchParams({
        commentId,
        postId: articleId,
      } as never).toString();
      return `/comments/reply?${queryString}` as const;
    },
  },
  user: {
    myInfo: () => '/members' as const,
    userInfo: (id: number) => `/members/${id}/default-information` as const,
    studentCertification: () => '/members/ssafy-certification' as const,

    myPortfolio: () => `/members/portfolio` as const,
    portfolio: (id: number) => `/members/${id}/portfolio` as const,

    ssafyBasicInfo: () => '/members/default-information' as const,
    nickname: () => '/members/nickname' as const,
    isMajor: () => '/members/major' as const,
    track: () => '/members/major-track' as const,
    profileVisibility: () => '/members/profile-public' as const,
    userProfileVisibility: (id: number) =>
      `/members/${id}/profile-public` as const,
  },
  recruit: {
    // todo 이름, 파라미터 수정
    list: () => '/recruits' as const,
    members: (recruitId: number) => `/recruits/${recruitId}/members` as const,
    detail: (recruitId: number) => `/recruits/${recruitId}/detail` as const,
    scrap: (recruitId: number) => `/recruits/${recruitId}/scrap` as const,
    apply: (recruitId: number) => `/recruits/${recruitId}/application` as const,
    application: {
      self: () => `/recruit-applications`,
      applicants: (recruitId: number) =>
        `${endpoints.recruit.application.self()}?recruitId=${recruitId}` as const,
    },
  },
  recruitComments: {
    list: (recruitId: number) => `/recruits/${recruitId}/comments` as const,
    create: (recruitId: number) => `/recruits/${recruitId}/comments` as const,
    detail: (commentId: number) => `/recruit-comments/${commentId}` as const, // 삭제, 수정
    like: (commentId: number) =>
      `${endpoints.recruitComments.detail(commentId)}/like` as const,
    report: (commentId: number) =>
      `${endpoints.recruitComments.detail(commentId)}/report` as const,
    reply: (params: { recruitId: number; commentId: number }) => {
      const { recruitId, commentId } = params;
      const queryString = new URLSearchParams({
        recruitId,
        commentId,
      } as never).toString();
      return `/recruit-comments/reply?${queryString}` as const;
    },
  },
  meta: {
    campuses: () => '/meta/campuses' as const,
    skills: () => '/meta/skills' as const,
    recruitTypes: () => '/meta/recruit-types' as const,
  },
  lunch: {
    list: ({ campus, date }: { campus: string; date: string }) => {
      const queryString = new URLSearchParams({ campus, date }).toString();
      return `/lunch?${queryString}`;
    },
    vote: (lunchId: number) => `/lunch/poll/${lunchId}` as const,
    revertVote: (lunchId: number) => `/lunch/poll/revert/${lunchId}` as const,
    error: () => `/lunch/error` as const,
  },
};
