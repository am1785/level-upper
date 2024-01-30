import React, { useState } from 'react'
import { Button, Box } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import TaskOngoing, { OngoingTask } from '../task/TaskOngoing';
import TaskInput from '../task/TaskInput';

const MTaskOngoing = React.memo(TaskOngoing);

export default function Backlog(){

    return (
        <Box>Backlog</Box>
    )

}