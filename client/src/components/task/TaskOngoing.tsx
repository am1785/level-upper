import React, {useCallback} from 'react'
import { Checkbox, Center, Box, Tag, HStack, Stack, Spacer, Button, IconButton, useDisclosure } from "@chakra-ui/react"
import { MinusIcon, EditIcon } from "@chakra-ui/icons"
import { AlertDialog,AlertDialogBody,AlertDialogFooter, AlertDialogHeader,AlertDialogContent,AlertDialogOverlay} from '@chakra-ui/react'
import { useQueryClient, useMutation, UseMutationResult } from '@tanstack/react-query'
// @ts-ignore
import * as taskApi from '../../api/tasks.js';

export type OngoingTask = {
    _id: string;
    title: string;
    link?: string;
    content?: string;
    skills: string[];
    status: string; // ongoing | completed
    exp: number;
    recurring: boolean;
    author: string;
}

export type OngoingTaskProps = {
    task: OngoingTask;
    onRemove: (id: string) => void;
    onExpand: (id: string) => void;
}

const TaskOngoing: React.FC<OngoingTaskProps> = ({task, onRemove, onExpand}) => {

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
      queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']})
    },
    // Add other options as needed
  });
};

  function DeleteTaskDialog() {
        const { isOpen, onOpen, onClose } = useDisclosure()
        const cancelRef = React.useRef(null)
        return (
          <>
            <IconButton sx={{position:'absolute', top:'-12px', right:'-12px'}} size={'13px'} variant='solid' colorScheme='red' isRound={true} aria-label='delete task' fontSize='13px' icon={<MinusIcon />} onClick={onOpen} />
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
        <Box key={task._id} boxShadow='base' p='5' rounded='md' bg='white' mt='3' mb='3' backdropFilter='auto' backdropContrast='30%'>
        <Stack direction='row-reverse' sx={{position: 'relative'}}>
            <DeleteTaskDialog />
        </Stack>
        <Stack>
            <HStack>
              <Checkbox isChecked={task.status === 'complete'} size={'xl'} onChange={(e) => changeStatusMutation(task._id, {status: e.target.checked ? "complete" : "ongoing"})}> </Checkbox>
              <p className='ongoingTitle'>{task.title}</p>
            </HStack>
            <HStack wrap='wrap' mt={'.5em'}>
                {task.skills.map((tg, id) => (
                <Tag key={id}>{tg}</Tag>
                ))} <Spacer /> <Tag>{task.exp}</Tag>
            </HStack>
        </Stack>
        <Center>
          <Button mt={'1em'} mb={'-.25em'} h={"1.25em"} w={"75%"} aria-label='expand task' onClick={()=> {onExpand(task._id);}}><EditIcon /></Button>
        </Center>
    </Box>
    {/* {editing && } */}

    </>)
}

export default TaskOngoing;