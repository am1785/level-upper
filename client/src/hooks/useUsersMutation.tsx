import { useQueryClient, useMutation } from '@tanstack/react-query';
import * as userApi from '../api/users';

type editUserMutationFn = {
    _id:string;
    update:any;
};

export const useEditUserMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ( {_id, update}: editUserMutationFn ) => userApi.editUserData(_id, update),
        mutationKey: ['editUser'],
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey: ['fetchUserData']});
            queryClient.invalidateQueries({queryKey: ['fetchUser']});
        }
    });
};