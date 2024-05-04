import { useQuery } from '@tanstack/react-query';
import * as userApi from '../api/users';

export const useOneUserData = (_ids:string) => {
    return useQuery({
        queryFn: () => userApi.fetchUser(_ids),
        queryKey: ['fetchUser', { _ids }],
      });
}