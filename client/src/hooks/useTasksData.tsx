import { useQuery } from '@tanstack/react-query';
import * as taskApi from '../api/tasks';
import * as backlogApi from '../api/backlog';

export const useOngoingTasksData = (author:string) => {
    return useQuery({
    queryFn: () => taskApi.fetchTasks(author),
    queryKey: ['fetchOngoingTasks', { author }],
    })
}

export const useAllTasksData = (author:string) => {
    return useQuery({
        queryFn: () => backlogApi.fetchAllTasks(author),
        queryKey: ['fetchOngoingTasks', { author }],
      });
}

export const useOneTaskData = (_ids:string) => {
    return useQuery({
        queryFn: () => taskApi.fetchView(_ids),
        queryKey: ['fetchOngoingTask', { _ids }],
      });
}