/* eslint-disable @typescript-eslint/ban-ts-comment */

import type {
  ApplyRecruitApiData,
  CreateRecruitApiData,
  GetRecruitDetailApiData,
  GetRecruitParticipantsApiData,
  ScrapRecruitApiData,
} from '~/services/recruit';

import { rest } from 'msw';

import { mockSuccess, restError, restSuccess } from '~/mocks/utils';
import { endpoints } from '~/react-query/common';
import { MatchStatus, RecruitCategoryName } from '~/services/recruit';
import { API_URL, composeUrls, removeQueryParams } from '~/utils';

import {
  createMockMyRecruitApplication,
  createMockRecruitApplicant,
  createMockRecruitApplication,
  RecruitData,
  recruitDetails,
  recruitParticipantsList,
  scrapStatus,
} from './data';
import { restInfiniteRecruitsSuccess } from './utils';

const getRecruitApplicantsEndpoint = removeQueryParams(
  composeUrls(API_URL, endpoints.recruit.application.applicants(1))
);
export const getRecruitApplicants = restSuccess(
  'get',
  getRecruitApplicantsEndpoint,
  {
    data: RecruitData.recruitApplicants,
  }
);

const getRecruitApplicationDetail = restSuccess(
  'get',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  composeUrls(API_URL, endpoints.recruit.application.detail(':recruitId')),
  {
    data: RecruitData.RecruitApplicationDetail,
  }
);

export const postRecruitApplicationApprove = restSuccess(
  'post',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  composeUrls(API_URL, endpoints.recruit.application.approve(':recruitId')),
  {
    data: {
      recruitApplicationId: 1,
      matchStatus: 'DONE',
    },
  }
);

export const postRecruitApplicationReject = restSuccess(
  'post',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  composeUrls(API_URL, endpoints.recruit.application.reject(':recruitId')),
  {
    data: {
      recruitApplicationId: 1,
      matchStatus: 'REJECT',
    },
  }
);

export const postRecruitApplicationCancel = restSuccess(
  'post',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  composeUrls(API_URL, endpoints.recruit.application.cancel(':recruitId')),
  {
    data: {
      recruitApplicationId: 1,
      matchStatus: 'CANCEL',
    },
  }
);

// 리쿠르팅 생성

const createRecruitEndpoint = endpoints.recruit.self();
const createRecruitHttpMethod = 'post';

export const createRecruit = restSuccess<CreateRecruitApiData['data']>(
  createRecruitHttpMethod,
  createRecruitEndpoint,
  {
    data: {
      recruitId: 1,
    },
  }
);

export const createRecruitError = restError(
  createRecruitHttpMethod,
  createRecruitEndpoint,
  {
    data: {
      message: '리쿠르팅 생성 실패',
    },
  }
);

// 리쿠르팅 상세정보 조회

const getRecruitDetailEndpoint =
  // @ts-ignore
  composeUrls(API_URL, endpoints.recruit.detail(':recruitId'));

export const getRecruitDetail = rest.get(
  getRecruitDetailEndpoint,
  (req, res, ctx) => {
    const recruitId = Number(req.params.recruitId as string);
    const recruitDetail = recruitDetails[recruitId];

    return res(
      ctx.delay(500),
      ...mockSuccess<GetRecruitDetailApiData['data']>(ctx, recruitDetail)
    );
  }
);

export const getRecruitDetailError = restError(
  'get',
  getRecruitDetailEndpoint,
  {
    message: '리쿠르트 디테일 조회 에러',
  }
);

// 리쿠르팅 참가자 조회
const getRecruitParticipantsEndpoint =
  // @ts-ignore
  composeUrls(API_URL, endpoints.recruit.members(':recruitId'));

export const getRecruitParticipants = rest.get(
  getRecruitParticipantsEndpoint,
  (req, res, ctx) => {
    const recruitId = Number(req.params.recruitId as string);

    const recruitParticipants = recruitParticipantsList[recruitId];

    return res(
      ctx.delay(500),
      ...mockSuccess<GetRecruitParticipantsApiData['data']>(ctx, {
        recruitTypes: recruitParticipants,
      })
    );
  }
);

export const getRecruitParticipantsError = restError(
  'get',
  getRecruitParticipantsEndpoint,
  {
    message: '리쿠르팅 참가자 조회에 실패했습니다.',
  }
);

// 리쿠르팅 스크랩

const scrapRecruitEndpoint =
  // @ts-ignore
  composeUrls(API_URL, endpoints.recruit.scrap(':recruitId'));

export const scrapRecruit = rest.post(scrapRecruitEndpoint, (req, res, ctx) => {
  const { scraped, scrapCount } = scrapStatus;
  const nextScraped = !scraped;
  const nextScrapCount = nextScraped ? scrapCount + 1 : scrapCount - 1;

  scrapStatus.scraped = nextScraped;
  scrapStatus.scrapCount = nextScrapCount;

  return res(
    ctx.delay(500),
    ...mockSuccess<ScrapRecruitApiData['data']>(ctx, {
      scraped: nextScraped,
      scrapCount: nextScrapCount,
    })
  );
});

export const scrapRecruitError = restError('post', scrapRecruitEndpoint, {
  message: '스크랩 업데이트에 실패했습니다.',
});

const removeRecruitEndpoint = getRecruitDetailEndpoint;
const removeRecruitMethod = 'delete';

export const removeRecruit = restSuccess(
  removeRecruitMethod,
  removeRecruitEndpoint,
  { data: null }
);

export const removeRecruitError = restError(
  removeRecruitMethod,
  removeRecruitEndpoint,
  { message: '리쿠르팅 삭제 실패' }
);

const updateRecruitEndpoint = getRecruitDetailEndpoint;
const updateRecruitMethod = 'patch';

export const updateRecruit = restSuccess(
  updateRecruitMethod,
  updateRecruitEndpoint,
  {
    data: null,
  }
);
export const updateRecruitError = restError(
  updateRecruitMethod,
  updateRecruitEndpoint,
  {
    message: '리쿠르트 업데이트 실패',
  }
);

const completeRecruitEndpoint =
  // @ts-ignore
  composeUrls(API_URL, endpoints.recruit.complete(':recruitId'));
const completeRecruitMethod = 'post';

export const completeRecruit = restSuccess(
  completeRecruitMethod,
  completeRecruitEndpoint,
  {
    data: null,
  }
);

export const completeRecruitError = restError(
  completeRecruitMethod,
  completeRecruitEndpoint,
  {
    message: '리쿠르팅 모집 완료 실패',
  }
);

const getRecruitsEndpoint = removeQueryParams(
  composeUrls(
    API_URL,
    endpoints.recruit.list({
      cursor: 1,
      recruitParts: [],
      skills: [],
      completed: false,
      keyword: '',
      size: 10,
      category: RecruitCategoryName.PROJECT,
    })
  )
);

export const getRecruits = rest.get(
  getRecruitsEndpoint,
  restInfiniteRecruitsSuccess
);

const applyRecruitEndpoint =
  // @ts-ignore
  composeUrls(API_URL, endpoints.recruit.apply(':recruitId'));
const applyRecruitMethod = 'post';

export const applyRecruit = restSuccess<ApplyRecruitApiData['data']>(
  applyRecruitMethod,
  applyRecruitEndpoint,
  {
    data: {
      matchStatus: MatchStatus.PENDING,
      recruitApplicationId: 301,
    },
  }
);

export const applyRecruitError = restError(
  applyRecruitMethod,
  applyRecruitEndpoint,
  {
    message: '리쿠르팅 지원 실패',
  }
);

const getMyRecruitApplicationEndpoint =
  // @ts-ignore
  composeUrls(API_URL, endpoints.recruit.application.mine(':recruitId'));

export const getMyRecruitApplication = rest.get(
  getMyRecruitApplicationEndpoint,
  (req, res, ctx) => {
    const recruitId = req.params.recruitId ?? 1;
    return res(
      ctx.delay(500),
      ...mockSuccess(
        ctx,
        createMockMyRecruitApplication(Number(recruitId), {
          recruitApplicationId: 1,
        })
      )
    );
  }
);

export const getMyRecruitApplicationError = restError(
  'get',
  getMyRecruitApplicationEndpoint,
  { message: '내 신청서 불러오기 오류' }
);

const getRecruitApplicationEndpoint = composeUrls(
  API_URL,
  // @ts-ignore
  endpoints.recruit.application.detail(':recruitApplicationId')
);
export const getRecruitApplication = rest.get(
  getRecruitApplicationEndpoint,
  (req, res, ctx) => {
    const recruitApplicationId = req.params.recruitApplicationId ?? 1;

    return res(
      ctx.delay(500),
      ...mockSuccess(
        ctx,
        createMockRecruitApplication(1, {
          recruitApplicationId: Number(recruitApplicationId),
        })
      )
    );
  }
);

export const getRecruitApplicationError = restError(
  'get',
  getRecruitApplicationEndpoint,
  { message: '다른 사람의 신청서 불러오기 오류' }
);

export const recruitHandlers = [
  //
  getRecruitApplicants,
  getRecruitApplicationDetail,
  postRecruitApplicationReject,
  postRecruitApplicationApprove,
  postRecruitApplicationCancel,
  //
  createRecruit,
  getRecruitDetail,
  getRecruitParticipants,
  scrapRecruit,
  removeRecruit,
  updateRecruit,
  completeRecruit,
  getRecruits,
  applyRecruit,
  getMyRecruitApplication,
  getRecruitApplication,
];
