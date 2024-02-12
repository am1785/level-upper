import React, { useState } from 'react'
import { Box, Flex } from "@chakra-ui/react"
import TaskOngoing, { OngoingTask } from '../task/TaskOngoing';
import TaskTable from '../backlog/TaskTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as backlogApi from '../../api/backlog';

export default function Backlog(){
    const user = 'default'; // TODO: get current user based on auth

    const { status, data, error } = useQuery({
        queryFn: () => backlogApi.fetchAllTasks(user),
        queryKey: ['fetchOngoingTasks', { user }],
      })

      if (status === 'pending') {
        return <span>Loading...</span>
      }

      else if (status === 'error') {
        return <span>Error: {error.message}</span>
      }

      else { // or status === 'success'
      }
    return (
        <Flex justify={'center'}>
            <TaskTable data={data} />
        </Flex>
    )

}