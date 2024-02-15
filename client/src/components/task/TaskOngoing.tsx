import React, {useCallback} from 'react'
import { Checkbox, Center, Box, Tag, HStack, Stack, Spacer, Button, IconButton, useDisclosure } from "@chakra-ui/react"
import { MinusIcon } from "@chakra-ui/icons"
import { AlertDialog,AlertDialogBody,AlertDialogFooter, AlertDialogHeader,AlertDialogContent,AlertDialogOverlay} from '@chakra-ui/react'
import { useQueryClient, useMutation, UseMutationResult } from '@tanstack/react-query'
import * as taskApi from '../../api/tasks';
import TaskEditModal from './TaskEditModal'

export type OngoingTask = {
    _id: string;
    title: string;
    link?: string;
    content?: string;
    skills: string[];
    status: string; // ongoing | complete
    exp: number;
    recurring: boolean;
    author: string;
    createdAt: string;
    updatedAt: string;
}

export type OngoingTaskProps = {
    task: OngoingTask;
    date: Date;
    onRemove: (id: string) => void;
    onExpand: (id: string) => void;
}

const TaskOngoing: React.FC<OngoingTaskProps> = ({task, date, onRemove, onExpand}) => {

// Assuming types for _id and update
type TaskId = string;
type TaskUpdate = any; // Adjust this type according to your data structure

const queryClient = useQueryClient();
const { mutate }: UseMutationResult<void, unknown, { _id: TaskId; update: TaskUpdate }> = useMutation({
  mutationFn: ({ _id, update }) => taskApi.editTask(_id, update),
  mutationKey: ['editTask'],
});

const changeStatusMutation = async (_id: TaskId, update: TaskUpdate) => {
  await mutate({ _id, update }, {
    onSuccess: (data, variables, context) => {
      // Handle success if needed
      queryClient.invalidateQueries({queryKey: ['deleteTask']});
      queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']});
      queryClient.invalidateQueries({queryKey: ['fetchSkills']});
    },
    // Add other options as needed
  });
};

 function DeleteTaskDialog() {
        const { isOpen, onOpen, onClose } = useDisclosure()
        const cancelRef = React.useRef(null)
        const diff = Math.abs(new Date(task.createdAt).valueOf() - date.valueOf());
        const day_diff = Math.floor((diff/1000)/60/60/24);
        const hr_diff =  Math.floor((diff/1000)/60/60) - day_diff * 24;
        const min_diff = Math.floor((diff/1000)/60) - hr_diff * 60;
        return (
          <>
            <HStack>
            <Box fontSize={'xs'} textColor={'gray.500'} className='ongoingAddedWhen' sx={{position:'absolute', top:'-14px', right:'10px'}}>{day_diff > 0 ? `${day_diff} day ${hr_diff} hr`: hr_diff > 0 ? `${hr_diff} hr ${min_diff} min`: `${min_diff} min`} ago</Box>
            <IconButton sx={{position:'absolute', top:'-12px', right:'-12px'}} size={'13px'} variant='solid' colorScheme='red' isRound={true} aria-label='delete task' fontSize='13px' icon={<MinusIcon />} onClick={onOpen} />
            </HStack>
            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
              size={'sm'}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Delete Task
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You can't undo this action afterwards.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button colorScheme='red' onClick={() => {onRemove(task._id); onClose();}} ml={2}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        )
      }

    return (<>
        <Box className={task.status === 'complete' ? 'completeTask' : 'ongoingTask'} key={task._id} boxShadow='base' p='5' rounded='md' bg='white' mt='3' mb='3' backdropFilter='auto' backdropContrast='30%'>
        <Stack direction='row-reverse' sx={{position: 'relative'}}>
            <DeleteTaskDialog />
        </Stack>
        <Stack>
            <HStack>
              <Checkbox isChecked={task.status === 'complete'} size={'xl'} onChange={(e) => changeStatusMutation(task._id, {author: "default", status: e.target.checked ? "complete" : "ongoing"})}> </Checkbox>
              <p className='ongoingTitle'>{task.title}</p>
            </HStack>
            <HStack wrap='wrap' mt={'.5em'}>
                {task.skills.map((tg, id) => (
                <Tag key={id}>{tg}</Tag>
                ))} <Spacer /> <Tag>{task.exp}</Tag>
            </HStack>
        </Stack>
        <Center>
            <TaskEditModal onSuccess={() => { queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']});
            queryClient.invalidateQueries({queryKey: ['fetchSkills']});}} task={task} className='ongoingEdit'/>
        </Center>
    </Box>
    {/* {editing && } */}

    </>)
}

export default TaskOngoing;