import type { CommentDetail } from '~/services/articleComment';
import type { ApiSuccessResponse } from '~/types';

import { endpoints } from '~/react-query/common';
import { privateAxios, publicAxios } from '~/utils';

export type GetRecruitCommentsApiData = ApiSuccessResponse<{
  comments: CommentDetail[];
}>;

export const getRecruitComments = (recruitId: number) => {
  const endpoint = endpoints.recruitComments.list(recruitId);

  return publicAxios
    .get<GetRecruitCommentsApiData>(endpoint)
    .then((res) => res.data.data.comments);
};

export interface CreateRecruitCommentParams {
  recruitId: number;
  content: string;
}

export interface CreateRecruitCommentBody {
  content: string;
}

export const createRecruitComment = (params: CreateRecruitCommentParams) => {
  const { recruitId, content } = params;
  const endpoint = endpoints.recruitComments.create(recruitId);

  const body: CreateRecruitCommentBody = {
    content,
  };

  return privateAxios.post(endpoint, body).then((res) => res.data);
};

export type LikeRecruitCommentApiData = ApiSuccessResponse<
  Pick<CommentDetail, 'liked' | 'likeCount'>
>;

export const likeRecruitComment = (recruitCommentId: number) => {
  const endpoint = endpoints.articleComments.like(recruitCommentId);

  return privateAxios
    .post<LikeRecruitCommentApiData>(endpoint, null)
    .then((res) => res.data.data);
};

export interface ReplyRecruitCommentParams {
  recruitId: number;
  recruitCommentId: number;
  content: string;
}

export type ReplyRecruitCommentBody = CreateRecruitCommentBody;

export const replyRecruitComment = (params: ReplyRecruitCommentParams) => {
  const { recruitCommentId, recruitId, content } = params;
  const endpoint = endpoints.recruitComments.reply({
    recruitCommentId,
    recruitId,
  });

  const body: ReplyRecruitCommentBody = {
    content,
  };

  return privateAxios.post(endpoint, body).then((res) => res.data);
};

export interface UpdateRecruitCommentParams {
  recruitCommentId: number;
  content: string;
}

export type UpdateRecruitCommentBody = CreateRecruitCommentBody;

export const updateRecruitComment = (params: UpdateRecruitCommentParams) => {
  const { recruitCommentId, content } = params;
  const endpoint = endpoints.recruitComments.detail(recruitCommentId);

  const body: UpdateRecruitCommentBody = {
    content,
  };

  return privateAxios.put(endpoint, body).then((res) => res.data);
};

export const removeRecruitComment = (recruitCommentId: number) => {
  const endpoint = endpoints.recruitComments.detail(recruitCommentId);

  return privateAxios.delete(endpoint).then((res) => res.data);
};
