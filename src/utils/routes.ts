import type { OAuthProviders } from '~/services/auth/utils';
import type {
  RecruitParts,
  SkillName,
  MatchStatus,
  RecruitCategoryName,
} from '~/services/recruit';

import { lunch } from '~/utils/client-routes/lunch';
import { recruit } from '~/utils/client-routes/recruit';

export const routes = {
  root: () => '/' as const,
  main: () => '/main' as const,
  article: {
    self: () => '/articles' as const,
    categories: () => `${routes.article.self()}/categories` as const,
    category: (categoryId: number, searchKeyword?: string) => {
      const queryString = searchKeyword ? `?keyword=${searchKeyword}` : '';
      return `${routes.article.categories()}/${categoryId}${queryString}` as const;
    },
    hot: (searchKeyword?: string) => {
      const queryString = searchKeyword ? `?keyword=${searchKeyword}` : '';
      return `/hot-articles${queryString}` as const;
    },
    detail: (articleId: number) =>
      `${routes.article.self()}/${articleId}` as const,
    edit: (articleId: number) =>
      `${routes.article.detail(articleId)}/edit` as const,
    create: (categoryId: number) =>
      `${routes.article.self()}/new?categoryId=${categoryId}` as const,
  },

  //
  signIn: () => '/auth/sign-in' as const,
  userRegister: () => '/auth/register' as const,
  callback: (provider: OAuthProviders) => `/auth/callback/${provider}` as const,

  //
  certification: {
    student: () => '/certification/student' as const,
  },

  //
  intro: {
    studentCertification: () => '/intro/student-certification' as const,
  },

  profile: {
    self: (tab?: string) => {
      if (tab) {
        return `/profile?tab=${tab}`;
      }

      return `/profile` as const;
    },
    detail: (id: number) => `${routes.profile.self()}/${id}` as const,
    myInfoSettings: () => `${routes.profile.self()}/myinfo-settings` as const,
    myArticles: () => `${routes.profile.self()}/my-articles` as const,
    myScraps: (category?: PossibleMyScrapsCategories) => {
      const route = `${routes.profile.self()}/my-scraps` as const;
      if (category) {
        return `${route}?tab=${category}` as const;
      }
      return route;
    },

    edit: {
      myInfo: (field: EditableMyInfoFields) =>
        `${routes.profile.myInfoSettings()}/${field}/edit` as const,

      portfolio: () => `${routes.profile.self()}/portfolio/edit` as const,
    },

    delete: {
      account: () =>
        `${routes.profile.myInfoSettings()}/account/delete` as const,
    },
  },

  //
  unauthorized: () => '/unauthorized' as const,

  //
  recruit,

  //
  lunch,
};

export enum EditableMyInfoFields {
  SSAFY_BASIC_INFO = 'ssafy-basic-info', // 기수, 캠퍼스, 멤버여부(학생 인증시 못바꿈)
  NICKNAME = 'nickname',
  IS_MAJOR = 'is-major',
  TRACK = 'track', // 인증된 상태에서만 바꿀 수 있음
}

export enum PossibleMyScrapsCategories {
  ARTICLES = 'articles',
  RECRUITS = 'recruits',
}

export type RecruitsPageQueryStringObject = {
  category: RecruitCategoryName;
  completed: string;
  keyword: string;
  skills: SkillName | SkillName[];
  recruitParts: RecruitParts | RecruitParts[];
};

export type AppliedRecruitsPageQueryStringObject = {
  category: RecruitCategoryName;
  matchStatus: MatchStatus;
};

interface RecruitApplicationRouteParams {
  recruitId: number;
  recruitApplicationId: number;
}
