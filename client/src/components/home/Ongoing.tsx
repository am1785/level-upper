import React, { useState, useEffect } from 'react'
import { Button, Box } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import TaskOngoing, { OngoingTask } from '../task/TaskOngoing';
import TaskInput from '../task/TaskInput';
import { useQuery } from '@tanstack/react-query';
// @ts-ignore
import * as taskApi from '../../api/tasks.js';

const MTaskOngoing = React.memo(TaskOngoing);

export default function Ongoing(){

    const currDate = new Date();
    let recentTasks: OngoingTask[] = [];
    let ongoingTasks: OngoingTask[] = [];
    const [adding, setAdding] = useState(false);

    const user = 'default'; // TODO: get current user based on auth

    /**
     * track rerendering
     */

    useEffect(() => {
        console.log('useEffect triggered!');
    }, [])

    // function to check if the task is ongoing (updated today)
    const isSameDay = (d:Date) => {
    return currDate.getDate() === d.getDate()
    && currDate.getMonth() === d.getMonth()
    && currDate.getFullYear() === d.getFullYear();
    }

    const { status, data, error } = useQuery({
        queryKey: ['fetchOngoingTasks'],
        queryFn: () => taskApi.fetchTasks(user),
      })

      if (status === 'pending') {
        return <span>Loading...</span>
      }

      else if (status === 'error') {
        return <span>Error: {error.message}</span>
      }

      else { // or status === 'success'
        recentTasks = data;
        data.forEach((d:any) => {
            const updateDate = new Date(d.updatedAt);
            if(isSameDay(updateDate)) {
                ongoingTasks.push(d);
            } else {
                console.log(`not ongoing task: ${d.title}`);
            }
        });
      }

    function removeTask(_id:string) {
        console.log(`removing task _id: ${_id}`);
    }
    return (<>
    <main>
        {!ongoingTasks || ongoingTasks.length == 0 && <Box boxShadow='md' p='5' rounded='md' bg='white' mt='3' mb='3'>add some tasks to level up today!</Box>}

        {ongoingTasks && ongoingTasks.length > 0 && ongoingTasks.map((t:any)=>(
            <MTaskOngoing key={t._id} task={t} onRemove={() => {removeTask(t._id)}} onExpand={()=> {console.log(t._id)}} />
        ))}

        <div style={{ marginTop:'1em'}}>
            {!adding ? <Button size="lg" onClick={() => setAdding(true)}><AddIcon sx={{marginRight:'10px'}}/>add</Button>
            : <Box boxShadow='base' p='5' rounded='md' bg='white' mt='3' mb='3'>
                <TaskInput recentTasks = {recentTasks} onCancel={() => setAdding(false)} />
            </Box>}
        </div>
    </main>
    </>)
}