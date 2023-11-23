import { getRemindAfterSeason } from '@/apis/client/getRemindAfterSeason';
import { getRemindSeason } from '@/apis/client/getRemindSeason';
import { useQuery } from '@tanstack/react-query';

export const useGetRemindQuery = (planId: number, isSeason: boolean) => {
  const { data } = useQuery({
    queryKey: ['getRemind', planId],
    queryFn: () => {
      return isSeason ? getRemindSeason(planId) : getRemindAfterSeason(planId);
    },
  });

  return { remindData: data!.data };
};
