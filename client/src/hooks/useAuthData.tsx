import { useQuery } from '@tanstack/react-query';
import * as authApi from '../api/auth';

export const useAuthData = () => {
    return useQuery({
        queryFn: () => authApi.fetchCurrentUserData(),
        queryKey: ['fetchUserData'],
    })
}