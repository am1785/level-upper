import React, { useState, useCallback, useEffect } from 'react'
import { Skeleton, useDisclosure, Text, Button, Box, Accordion, AccordionIcon, AccordionItem, AccordionButton, AccordionPanel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, HStack, VStack, IconButton } from "@chakra-ui/react"
import { StarIcon, AddIcon, CheckCircleIcon } from "@chakra-ui/icons"
import TaskOngoing, { OngoingTask } from '../task/TaskOngoing';
import TaskInput from '../task/TaskInput';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as taskApi from '../../api/tasks';

// const MTaskOngoing = React.memo(TaskOngoing);

export default function Ongoing(){

    const [currDate, setCurrDate] = useState(new Date());
    let recentTasks: OngoingTask[] = [];
    let ongoingTasks: OngoingTask[] = [];
    let weeklyTasks: OngoingTask[] = [];
    let ongoingExp = 0;
    let ongoingComplete = 0;
    let weeklyExp = 0;
    let weeklyComplete = 0;

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

    const { status:collectionStatus, data:collectionData, error:collectionError } = useQuery({
        queryFn: () => taskApi.fetchCollections(user),
        queryKey: ['fetchCollections', { user }],
    })

      // if (status === 'pending') { <= this entire conditional is prone to rendered more hooks than pervious due to the early return
      //   return <span>Loading...</span>
      // }

      // else if (status === 'error') {
      //   return <span>Error: {error.message}</span>
      // }

      // else { // or status === 'success'
      //   recentTasks = data;
      //   data.forEach((d:any) => {
      //       const createdDate = new Date(d.createdAt);
      //       const diff = dayDiff(createdDate)
      //       if(diff === 0) {
      //           ongoingTasks.push(d);
      //       } else if(diff === 1) {
      //         yesterdayTasks.push(d);
      //       } else {
      //         // console.log(`not ongoing task: ${d.title}`);
      //       }
      //   });
      // }

      data?.forEach((d:any) => {
              const createdDate = new Date(d.updatedAt); // checking update date instead
              const diff = dayDiff(createdDate)
              if(diff === 0) {
                  ongoingTasks.push(d);
                  if(d.status === "complete") {
                    weeklyExp += d.exp;
                    ongoingExp += d.exp;
                    ongoingComplete += 1;
                    weeklyComplete += 1}
              } else if(diff <= 7) {
                weeklyTasks.push(d);
                if(d.status === "complete") {
                  weeklyExp += d.exp;
                  weeklyComplete += 1
                }
              } else {
                // console.log(`not ongoing task: ${d.title}`);
              }
            }
      )

    const removeTask = (_id:string) => {
        // console.log(`removing task _id: ${_id}`);
        removeTaskMutation(_id);
    }

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (<>
    <main>
        {status === "pending" ? <Stack><Skeleton height='20px' /><Skeleton height='20px' /></Stack> : status === "error" ? <Text>{error.message}</Text>:null}
        {!ongoingTasks || ongoingTasks.length == 0 && <Box boxShadow='md' p='5' rounded='md' bg='white' mt='3' mb='3'>add some tasks to level up today!</Box>}

        {!!ongoingTasks && <Box fontSize={'xs'} mb={'5'}>
                <HStack justify={'end'}>
                  <Text>complete</Text>
                  <CheckCircleIcon color={'green.400'}/>
                  <Text>{ongoingComplete}</Text>
                </HStack>
                <HStack justify={'end'}>
                  <Text>earned</Text>
                  <StarIcon color={'yellow.300'}/>
                  <Text>{ongoingExp}</Text>
                </HStack>
              </Box>}

        {ongoingTasks && ongoingTasks.length > 0 && collectionStatus === 'success' && ongoingTasks.map((t:any)=>(
            <TaskOngoing key={t._id} task={t} date={currDate} collections={collectionData} onRemove={() => {removeTask(t._id)}} onExpand={()=> {console.log(t._id)}} />
        ))}

        <Box mt={'1em'}>
        <IconButton onClick={onOpen} icon={<AddIcon/>} aria-label='addTask' colorScheme='blue' isRound={true}></IconButton>
        <Modal isOpen={isOpen} onClose={onClose} isCentered size={'lg'} scrollBehavior={'inside'}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add Task</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <TaskInput recentTasks = {recentTasks} onCancel={onClose} />
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>

        <Accordion allowToggle mt={'1em'}>
          <AccordionItem>
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  <Text color={'gray.600'}>this week</Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            <AccordionPanel pb={4}>
              {!!weeklyTasks && <Box fontSize={'xs'} mb={'5'}>
                <HStack justify={'end'}>
                  <Text>complete</Text>
                  <CheckCircleIcon color={'green.400'}/>
                  <Text>{weeklyComplete}</Text>
                </HStack>
                <HStack justify={'end'}>
                  <Text>earned</Text>
                  <StarIcon color={'yellow.300'}/>
                  <Text>{weeklyExp}</Text>
                </HStack>
              </Box>}
              {!!weeklyTasks.length && collectionStatus === 'success' && weeklyTasks.map((t: OngoingTask) => ( // !! idea comes fromhttps://www.youtube.com/watch?v=iTi15aHk778
                <TaskOngoing key={t._id} task={t} date={currDate} collections={collectionData} onRemove={() => {removeTask(t._id)}} onExpand={()=> {console.log(t._id)}} />
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
    </main>
    </>)
}