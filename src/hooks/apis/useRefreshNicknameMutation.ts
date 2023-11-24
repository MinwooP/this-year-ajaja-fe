import { postUsersRefresh } from '@/apis/client/postUsersRefresh';
import { useMutation } from '@tanstack/react-query';

export const usePostUsersRefreshMutation = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: postUsersRefresh,
  });

  return { refreshNickname: mutate, isPending };
};
