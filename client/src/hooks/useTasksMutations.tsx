import { useMutation } from "@tanstack/react-query";
import { OngoingTask } from "../components/task/TaskOngoing";
import * as taskApi from '../api/tasks';
import { Toast } from "@chakra-ui/react";
import LevelupIcon from '../assets/img/icon.png'

type editTaskMutationFn = {
    _id:string;
    update:any;
};

type changeTaskStatusMutationFn = {
    _id:string;
    update:any;
};

export const useEditTaskMutation = (toast:typeof Toast, onSuccess:any) => { return useMutation({

    mutationFn: ( {_id, update}: editTaskMutationFn ) => taskApi.editTask(_id, update),
    mutationKey: ['editTask'],
    onSuccess: () => {
        toast({
          title: 'success',
          status: 'success',
          duration: 1250,
          isClosable: true,
          });
        onSuccess();
      },
      onError: () => {
        toast({
            title: 'error',
            status: 'error',
            duration: 1250,
            isClosable: true,
            });
      }
    });
};

export const useChangeTaskStatusMutation = (toast:typeof Toast, task:OngoingTask, queryClient:any) => {

    return useMutation({
        mutationFn: ( {_id, update} :changeTaskStatusMutationFn) => taskApi.editTask(_id, update),
        mutationKey: ['editTask'],
        onSuccess: () => {
            // Handle success if needed
            queryClient.invalidateQueries({queryKey: ['deleteTask']});
            queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']});
            queryClient.invalidateQueries({queryKey: ['fetchSkills']});

            if (task.status === "ongoing") {toast({
              title: 'level up!',
              status: 'info',
              description: `earned ${task.exp} exp!`,
              duration: 3000,
              isClosable: true,
              variant: "subtle",
              icon: <img src={LevelupIcon} style={{height:"1.25em", marginTop: "0.15em"}}/>
              });
            }
          },
    })
}

export const useChangeTaskHiddenMutation = (toast:typeof Toast, task:OngoingTask, queryClient:any) => {

    return useMutation({
        mutationFn: ( {_id, update} :changeTaskStatusMutationFn) => taskApi.editTask(_id, update),
        mutationKey: ['editTask'],
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['deleteTask']});
            queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']});
            queryClient.invalidateQueries({queryKey: ['fetchSkills']});

            if (task.status === "ongoing") {toast({
              title: 'success',
              status: 'success',
              description: `task hidden`,
              duration: 2250,
              isClosable: true,
              variant: "subtle",
              });
            }
          },
    })
}