import { useQueryClient, useMutation } from '@tanstack/react-query';
import * as authApi from '../api/auth';
import { Navigate } from 'react-router-dom';

type userRegisterMutationFn = {
    email:string;
    password:any;
};

export const useRegisterMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({email, password}:userRegisterMutationFn) => authApi.registerUser(email, password),
        mutationKey: ['registerUser'],
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['registerUser']});
            queryClient.invalidateQueries({queryKey: ['fetchUserData']});
        }
      });
}

export const useLoginMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({email, password}:userRegisterMutationFn) => authApi.loginUser(email, password),
        mutationKey: ['loginUser'],
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['loginUser']});
            queryClient.invalidateQueries({queryKey: ['fetchUserData']});
        }
      });
}

export const useLogoutMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authApi.logoutUser(),
        mutationKey: ['logoutUser'],
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['loginUser']});
            queryClient.invalidateQueries({queryKey: ['logoutUser']});
            queryClient.invalidateQueries({queryKey: ['fetchUserData']});
        }
      });
}