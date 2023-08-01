import type { UserInfo } from '~/services/member';

export interface ArticleCategory {
  boardId: number;
  title: string;
  description: string;
  imageUrl: string;
}

export interface ArticleImage {
  imageUrl: string;
  imagePath: string;
}

export type ArticleAuthor =
  | {
      anonymous: false;
      author: Omit<UserInfo, 'memberId'>;
    }
  | {
      anonymous: true;
      author: Pick<UserInfo, 'nickname'>;
    };

export interface ArticleDetailWithoutAuthor {
  title: string;
  content: string;

  likeCount: number;
  commentCount: number;
  scrapCount: number;

  liked: boolean;
  scraped: boolean;

  createdAt: string;
  modified: boolean;
  mine: boolean;
  images: ArticleImage[];

  // NOTE: 아직 반영이 안 된 타입들
  postId: number;
  category: ArticleCategory;
}

export type ArticleDetail = ArticleDetailWithoutAuthor & ArticleAuthor;

export interface ArticleDetailError {
  error: {
    isUnknownError: boolean;
    message: string;
  };
}

export interface ArticleSummary {
  boardTitle: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  nickname: string;
  anonymous: boolean;
  thumbnail: string; // 안 쓰임

  // NOTE: 아직 반영 안됨
  postId: number;
}

export interface HotArticleSummary extends ArticleSummary {}
