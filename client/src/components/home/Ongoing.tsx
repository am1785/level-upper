import React, { useState, useCallback, useEffect } from 'react'
import { Text, Button, Box, Accordion, AccordionIcon, AccordionItem, AccordionButton, AccordionPanel } from "@chakra-ui/react"
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
    let yesterdayTasks: OngoingTask[] = [];
    const [adding, setAdding] = useState(false);

    const user = 'default'; // TODO: get current user based on auth

    // function to check if the task is ongoing (updated today / yesterday)
    const dayDiff = useCallback((d:Date) => {
    if (currDate.getFullYear() === d.getFullYear() && currDate.getMonth() === d.getMonth()) {
      return currDate.getDate() - d.getDate()
    } else {
      return 30
    }
    }, [currDate]);

    // update currDate state every minute
    useEffect(() => {
      const currDateInterval = setInterval(() => {
        setCurrDate(new Date());
      }, 60000);

      // Cleanup function to clear the interval when the component unmounts
      return () => clearInterval(currDateInterval);

    }, []); // empty dependency array means this effect runs once on mount and cleans up on unmount

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
            const diff = dayDiff(createdDate)
            if(diff === 0) {
                ongoingTasks.push(d);
            } else if(diff === 1) {
              yesterdayTasks.push(d);
            } else {
              // console.log(`not ongoing task: ${d.title}`);
            }
        });
      }

    const removeTask = (_id:string) => {
        // console.log(`removing task _id: ${_id}`);
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

        <Accordion allowToggle mt={'1em'}>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  <Text color={'gray.600'}>Yesterday</Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {!!yesterdayTasks.length && yesterdayTasks.map((t: OngoingTask) => ( // !! idea comes fromhttps://www.youtube.com/watch?v=iTi15aHk778
                <MTaskOngoing key={t._id} task={t} date={currDate} onRemove={() => {removeTask(t._id)}} onExpand={()=> {console.log(t._id)}} />
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
    </main>
    </>)
}