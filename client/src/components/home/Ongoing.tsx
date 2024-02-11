import React, { useState, useCallback } from 'react'
import { Button, Box } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import TaskOngoing, { OngoingTask } from '../task/TaskOngoing';
import TaskInput from '../task/TaskInput';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as taskApi from '../../api/tasks';

const MTaskOngoing = React.memo(TaskOngoing);

export default function Ongoing(){

    const [currDate, setCurrDate] = useState(new Date());
    let recentTasks: OngoingTask[] = [];
    let ongoingTasks: OngoingTask[] = [];
    const [adding, setAdding] = useState(false);

    const user = 'default'; // TODO: get current user based on auth

    // function to check if the task is ongoing (updated today)
    const isSameDay = useCallback((d:Date) => {
    return currDate.getDate() === d.getDate()
    && currDate.getMonth() === d.getMonth()
    && currDate.getFullYear() === d.getFullYear();
    }, [currDate]);

    // update currDate state every minute
    const currDateInterval = setInterval(()=>{
      setCurrDate(new Date());
    }, 60000)

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: (_id:string) => taskApi.deleteTask(_id),
        mutationKey: ['deleteTask'],
      });

      const removeTaskMutation = async (_id:string) =>
        await mutate(_id, {
          onSuccess(data, variables, context) {
            queryClient.invalidateQueries({queryKey: ['deleteTask']});
            queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']});
            queryClient.invalidateQueries({queryKey: ['fetchSkills']});
          },
        })

    const { status, data, error } = useQuery({
        queryFn: () => taskApi.fetchTasks(user),
        queryKey: ['fetchOngoingTasks', { user }],
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
            const createdDate = new Date(d.createdAt);
            if(isSameDay(createdDate)) {
                ongoingTasks.push(d);
            } else {
                // console.log(`not ongoing task: ${d.title}`);
            }
        });
      }

    function removeTask(_id:string) {
        console.log(`removing task _id: ${_id}`);
        removeTaskMutation(_id);
    }
    return (<>
    <main>
        {!ongoingTasks || ongoingTasks.length == 0 && <Box boxShadow='md' p='5' rounded='md' bg='white' mt='3' mb='3'>add some tasks to level up today!</Box>}

        {ongoingTasks && ongoingTasks.length > 0 && ongoingTasks.map((t:any)=>(
            <MTaskOngoing key={t._id} task={t} date={currDate} onRemove={() => {removeTask(t._id)}} onExpand={()=> {console.log(t._id)}} />
        ))}

        <div style={{ marginTop:'1em'}}>
            {!adding ? <Button size="lg" onClick={() => setAdding(true)}><AddIcon sx={{marginRight:'10px'}}/>add</Button>
            : <Box boxShadow='inner' p='5' rounded='lg' bg='white' mt='3' mb='3'>
                <TaskInput recentTasks = {recentTasks} onCancel={() => setAdding(false)} />
            </Box>}
        </div>
    </main>
    </>)
}