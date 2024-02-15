import React, { useState } from 'react'
import { Box, Flex, Skeleton, Stack } from "@chakra-ui/react"
import TaskOngoing, { OngoingTask } from '../task/TaskOngoing';
import TaskTable from '../backlog/TaskTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as backlogApi from '../../api/backlog';
import * as taskApi from '../../api/tasks';

export default function Backlog(){
    const user = 'default'; // TODO: get current user based on auth

    const { status, data, error } = useQuery({
        queryFn: () => backlogApi.fetchAllTasks(user),
        queryKey: ['fetchOngoingTasks', { user }],
      })

    return (
        <Flex justify={'center'}>
            {status === 'pending' ? <Stack><Skeleton height='20px' /><Skeleton height='20px' /></Stack>: status === 'success' ? <TaskTable data={data}/> : null}
        </Flex>
    )

}