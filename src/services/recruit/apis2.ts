import type {
  RecruitType,
  MatchStatus,
  RecruitParts,
  SkillName,
  RecruitCategoryType,
} from './utils';
import type { UserInfo } from '../member';
import type { ApiSuccessResponse } from '~/types';

import { endpoints } from '~/react-query/common';
import { privateAxios, publicAxios } from '~/utils';

export type RecruitParams = {
  category?: RecruitCategoryType;
  keyword?: string;
  isFinished?: boolean;
  recruitTypes?: RecruitParts[];
  skills?: SkillName[];
};

export interface Recruit {
  recruitId: number;
  title: string;
  finishedRecruit: boolean;
  recruitEnd: string;

  content: string;

  skills: RecruitSkills[];

  participants: RecruitParticipant[];
}

export interface RecruitSkills {
  id: number;
  name: SkillName;
}

export interface RecruitParticipant {
  recruitType: RecruitParts;
  limit: number;
  members: {
    nickname: string;
    major: boolean;
  }[];
}

export interface RecruitMembers {
  limit: number;
  members: UserInfo[];
}

export type RecruitMembersByParts = { [key in RecruitParts]?: RecruitMembers };

export type RecruitMembersApiData = ApiSuccessResponse<{
  recruitTypes: RecruitMembersByParts;
}>;

export type RecruitMember = UserInfo;

export type PartialRecruitType = Partial<RecruitType>;
export type recruitMembersType = {
  recruitTypes: Partial<Record<PartialRecruitType, RecruitMembers>>;
};

export type GetRecruitMembersApiData = ApiSuccessResponse<recruitMembersType>;

export const getRecruitMembers = (recruitId: number) => {
  const endpoint = endpoints.recruit.members(recruitId);
  return publicAxios
    .get<GetRecruitMembersApiData>(endpoint)
    .then((res) => res.data.data);
};

export interface RecruitApplyParams {
  recruitType: RecruitType;
  contents: Array<string>;
}

export type RecruitApplyParamsApiData = ApiSuccessResponse<RecruitApplyParams>;

export const postRecruitApply = ({
  recruitId,
  body,
}: {
  recruitId: number;
  body: RecruitApplyParams;
}) => {
  const endpoint = endpoints.recruit.apply(recruitId);
  return privateAxios
    .post<GetRecruitMembersApiData>(endpoint, body)
    .then((res) => res.data);
};

// ---------------------------------------

export interface RecruitApplicant {
  recruitApplicationId: number;
  matchStatus: MatchStatus;
  author: UserInfo;
  reply: string;
  question: string;
  liked: boolean;
  appliedAt: string;
}

export type GetRecruitApplicantsApiData = ApiSuccessResponse<{
  recruitId: number;
  recruitApplications: {
    [key in RecruitParts]?: RecruitApplicant[];
  };
}>;

export const getRecruitApplicants = (recruitId: number) => {
  const endpoint = endpoints.recruit.application.applicants(recruitId);

  return privateAxios
    .get<GetRecruitApplicantsApiData>(endpoint)
    .then((res) => res.data.data);
};

// ---------------------------------

export const getRecruitApplicationDetail = (recruitApplicationId: number) => {
  const endpoint = endpoints.recruit.application.detail(recruitApplicationId);

  return privateAxios
    .get<GetRecruitApplicationDetailApiData>(endpoint)
    .then((res) => res.data.data);
};

interface RecruitApplicationDetail {
  recruitId: number;
  recruitApplicationId: number;
  recruitType: RecruitParts;
  matchStatus: MatchStatus;
  author: UserInfo;
  reply: string;
  question: string;
  liked: boolean;
}
export type GetRecruitApplicationDetailApiData =
  ApiSuccessResponse<RecruitApplicationDetail>;

// ------------------------------

export const postRecruitApplicationApprove = (recruitApplicationId: number) => {
  const endpoint = endpoints.recruit.application.approve(recruitApplicationId);
  const body = {
    recruitApplicationId,
    matchStatus: 'DONE',
  };
  return privateAxios.post(endpoint, body).then((res) => res.data.data);
};

export const postRecruitApplicationReject = (recruitApplicationId: number) => {
  const endpoint = endpoints.recruit.application.reject(recruitApplicationId);
  const body = {
    recruitApplicationId,
    matchStatus: 'DONE',
  };
  return privateAxios.post(endpoint, body).then((res) => res.data.data);
};

export const postRecruitApplicationCancel = (recruitApplicationId: number) => {
  const endpoint = endpoints.recruit.application.cancel(recruitApplicationId);
  const body = {
    recruitApplicationId,
    matchStatus: 'CANCEL',
  };
  return privateAxios.post(endpoint, body).then((res) => res.data.data);
};

export const recruitAPI = {
  getRecruitMembers,
  getRecruitApplicants,
  postRecruitApply,
  getRecruitApplicationDetail,
  postRecruitApplicationApprove,
  postRecruitApplicationReject,
  postRecruitApplicationCancel,
};
