import type {
  GetLunchMenuSummariesApiData,
  LunchMenuSummaries,
} from '~/services/lunch';

import { restError, restSuccess } from '~/mocks/utils';
import { endpoints } from '~/react-query/common';
import { API_URL, composeUrls } from '~/utils';

import { lunchMock } from './data';

// export const getLunchMenusErrorMocking = restError(
//   'get',
//   composeUrls(API_URL, 'lunch/error'),
//   {
//     code: '500',
//     data: null,
//     statusCode: 500,
//   }
// );

export const getLunchMenuSummaries = restSuccess<
  GetLunchMenuSummariesApiData['data']
>(
  'get',
  composeUrls(
    API_URL,
    endpoints.lunch.summaries({ campus: '서울', date: 'today' })
  ),
  {
    data: lunchMock.menuSummaries,
  }
);
//
// export const getLunchDetailMocking = restSuccess<LunchMenuDetail>(
//   'get',
//   composeUrls(API_URL, endpoints.lunch.detail(2)),
//   {
//     data: LunchData.detail,
//   }
// );
//
// export const voteLunchMenuMocking = restSuccess<{ pollCount: number }>(
//   'post',
//   composeUrls(API_URL, endpoints.lunch.vote(2)),
//   {
//     data: LunchData.vote,
//   }
// );
//
// export const revertVoteLunchMenuMocking = restSuccess<{ pollCount: number }>(
//   'post',
//   composeUrls(API_URL, endpoints.lunch.revertVote(2)),
//   {
//     data: LunchData.revertVote,
//   }
// );

export const lunchHandlers = [
  getLunchMenuSummaries,
  // getLunchMenusMocking,
  // getLunchDetailMocking,
  // voteLunchMenuMocking,
  // revertVoteLunchMenuMocking,
  // getLunchMenusErrorMocking,
];
