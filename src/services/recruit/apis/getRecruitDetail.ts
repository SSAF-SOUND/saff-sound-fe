import type { RecruitDetail } from '~/services/recruit';
import type { ApiSuccessResponse } from '~/types';

import { endpoints } from '~/react-query/common';
import { privateAxios } from '~/utils';

export type GetRecruitDetailApiData = ApiSuccessResponse<RecruitDetail>;

export const getRecruitDetail = (recruitId: number) => {
  const endpoint = endpoints.recruit.detail(recruitId);

  return privateAxios
    .get<GetRecruitDetailApiData>(endpoint)
    .then((res) => res.data.data);
};