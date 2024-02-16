import React, { useState } from 'react'
import { Box, Flex, Skeleton, Stack } from "@chakra-ui/react"
import TaskOngoing, { OngoingTask } from '../task/TaskOngoing';
import TaskTable from '../backlog/TaskTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as backlogApi from '../../api/backlog';
import * as taskApi from '../../api/tasks';

export default function Backlog(){

    return (
        <Flex justify={'center'}>
            <TaskTable />
        </Flex>
    )

}