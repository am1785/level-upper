import { useQueryClient, useMutation } from '@tanstack/react-query';
import * as authApi from '../api/auth';

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
        }
      });
}