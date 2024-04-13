import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as taskApi from '../api/tasks';


export const useRemoveTaskMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
    mutationFn: (_id:string) => taskApi.deleteTask(_id),
    mutationKey: ['deleteTask'],
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['deleteTask']});
        queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']});
        queryClient.invalidateQueries({queryKey: ['fetchSkills']});
    }
  });
}