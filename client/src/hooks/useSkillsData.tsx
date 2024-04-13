import { useQuery } from '@tanstack/react-query';
import * as skillsApi from '../api/skills';

export const useSkillsData = (author:string, collection:string) => {
    return useQuery({
        queryFn: () => skillsApi.fetchSkills(author, collection),
        queryKey: ['fetchSkills', { author, collection }],
      });
}