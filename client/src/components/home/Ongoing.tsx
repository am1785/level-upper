import React, { useState, useCallback, useEffect } from 'react'
import { Skeleton, useDisclosure, Text, Button, Box, Accordion, AccordionIcon, AccordionItem, AccordionButton, AccordionPanel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, HStack, VStack, IconButton, ModalFooter, Link } from "@chakra-ui/react"
import { StarIcon, AddIcon, CheckCircleIcon } from "@chakra-ui/icons"
import TaskOngoing, { OngoingTask } from '../task/TaskOngoing';
import TaskInput from '../task/TaskInput';
import { useOngoingTasksData } from '../../hooks/useTasksData';
import { useCollectionsData } from '../../hooks/useCollectionsData';
import { useRemoveTaskMutation } from '../../hooks/useRemoveTaskMutation';

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
    if (currDate.getFullYear() === d.getFullYear() && currDate.getMonth() - d.getMonth() <= 1) {
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

    const { status, data, error } = useOngoingTasksData(user);
    const { status:collectionStatus, data:collectionData } = useCollectionsData(user);
    const { mutate:removeTaskMutate } = useRemoveTaskMutation();

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
              const updatedDate = new Date(d.updatedAt); // checking update date instead
              const diff = dayDiff(updatedDate);
              // console.log(diff);
              if(diff === 0) {
                  ongoingTasks.push(d);
                  if(d.status === "complete") {
                    weeklyExp += d.exp;
                    ongoingExp += d.exp;
                    ongoingComplete += 1;
                    weeklyComplete += 1}
              } else if(diff <= 7 && diff >= -24) {
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

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen:isLinkOpen, onOpen:onLinkOpen, onClose:onLinkClose} = useDisclosure();
    const [link, setLink] = useState<string>("");

    const LinkAlertModal: React.FC<{href:string}> = ({href})=> {
      function getLink(url:string) {
        window.open(url, "_blank");
      }
      return(
      <Modal isOpen={isLinkOpen} onClose={onLinkClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Redirect to external link</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            You are about to leave Levelupper for an external link at: <Link color={'blue.500'} href={href}>{href}</Link>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onLinkClose}>
              Close
            </Button>
            <Button colorScheme='blue' onClick={() => {getLink(href); onLinkClose()}}>Go</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      )
    }
    // console.log(weeklyTasks);

    return (<>
    <main style={{minHeight: "100vh"}}>
        {status === "pending" ? <Stack><Skeleton height='20px' /><Skeleton height='20px' /></Stack> : status === "error" ? <Text>{error.message}</Text>: <LinkAlertModal href={link} />}
        {!ongoingTasks || ongoingTasks.length == 0 && <Box boxShadow='md' p='5' rounded='md' mt='3' mb='3'>add some tasks to level up today!</Box>}

        {ongoingTasks && ongoingTasks.length > 0 && collectionStatus === 'success' && ongoingTasks.map((t:any)=> {
            return <TaskOngoing key={t._id} task={t} date={currDate} collections={collectionData} onRemove={() => {removeTaskMutate(t._id)}} onClickLink={() => {t.link && setLink(t.link); onLinkOpen()}}/>
        })}

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
              {!!weeklyTasks.length && collectionStatus === 'success' && weeklyTasks.map((t: OngoingTask) => { // !! idea comes fromhttps://www.youtube.com/watch?v=iTi15aHk778
                return <TaskOngoing key={t._id} task={t} date={currDate} collections={collectionData} onRemove={() => {removeTaskMutate(t._id)}} onClickLink={() => {t.link && setLink(t.link); onLinkOpen()}}/>
                })
              }
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
    </main>
    </>)
}