import { useQuery } from '@tanstack/react-query';
import * as taskApi from '../api/tasks';

export const useCollectionsData = (author:string) => {
    return useQuery({
        queryFn: () => taskApi.fetchCollections(author),
        queryKey: ['fetchCollections', { author }],
    })
}