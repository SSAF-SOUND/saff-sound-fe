import { useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '~/react-query/common';
import { getHasNewNotifications } from '~/services/notifications';

export interface UseHasNewNotificationsOptions {
  refetchInterval?: number;
  enabled?: boolean;
}

export const useHasNewNotifications = (
  options: UseHasNewNotificationsOptions
) => {
  const { refetchInterval, enabled } = options;
  const queryKey = queryKeys.notification.hasNew();
  return useQuery({
    queryKey,
    queryFn: getHasNewNotifications,
    refetchInterval,
    enabled,
  });
};

export const useCheckNewNotifications = () => {
  const queryClient = useQueryClient();
  const checkNewNotifications = () =>
    queryClient.setQueryData<boolean>(queryKeys.notification.hasNew(), true);

  return checkNewNotifications;
};
