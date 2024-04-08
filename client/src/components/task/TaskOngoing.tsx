import React, {useCallback} from 'react'
import { Checkbox, Flex, Spacer, Box, Tag, HStack, Stack, Button, IconButton, useDisclosure, ButtonGroup, useToast } from "@chakra-ui/react"
import { MinusIcon, ViewIcon } from "@chakra-ui/icons"
import { Link, AlertDialog,AlertDialogBody,AlertDialogFooter, AlertDialogHeader,AlertDialogContent,AlertDialogOverlay} from '@chakra-ui/react'
import { useQueryClient, useMutation, UseMutationResult } from '@tanstack/react-query'
import * as taskApi from '../../api/tasks';
import TaskEditModal from './TaskEditModal'
import { EXP_MAP } from '../backlog/TaskTable';
import TaskCollectionPopover from './TaskCollectionPopover'
import LevelupIcon from '../../assets/img/icon.png'

export type OngoingTask = {
    _id: string;
    title: string;
    link?: string;
    content?: string;
    skills: string[];
    status: string; // ongoing | complete
    exp: number;
    hidden: boolean;
    author: string;
    task_collection: string[];
    createdAt: string;
    updatedAt: string;
}

export type OngoingTaskProps = {
    task: OngoingTask;
    date: Date;
    collections: string[];
    onRemove: (id: string) => void;
    onClickLink: () => void;
}

const TaskOngoing: React.FC<OngoingTaskProps> = ({task, date, collections, onRemove, onClickLink}) => {

// TODO: memo edit modals and collection popovers for performance
// const MEditModal = React.memo(TaskEditModal);
// const MCollectionPopover = React.memo(TaskCollectionPopover);

const queryClient = useQueryClient();
const { mutate }: UseMutationResult<void, unknown, { _id: string; update: any }> = useMutation({
  mutationFn: ({ _id, update }) => taskApi.editTask(_id, update),
  mutationKey: ['editTask'],
});

const toast = useToast();

const changeStatusMutation = async (_id: string, update: any) => {
  await mutate({ _id, update }, {
    onSuccess: () => {
      // Handle success if needed
      queryClient.invalidateQueries({queryKey: ['deleteTask']});
      queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']});
      queryClient.invalidateQueries({queryKey: ['fetchSkills']});

      if (task.status === "ongoing") {toast({
        title: 'level up!',
        status: 'info',
        description: `earned ${task.exp} exp!`,
        duration: 3000,
        isClosable: true,
        variant: "subtle",
        icon: <img src={LevelupIcon} style={{height:"1.25em", marginTop: "0.15em"}}/>
        });
      }
    },
    // Add other options as needed
  });
};

const changeHideMutation = async (_id: string, update: any) => {
  await mutate({ _id, update }, {
    onSuccess: () => {
      // Handle success if needed
      queryClient.invalidateQueries({queryKey: ['deleteTask']});
      queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']});
      queryClient.invalidateQueries({queryKey: ['fetchSkills']});

      if (task.status === "ongoing") {toast({
        title: 'success',
        status: 'success',
        description: `task hidden`,
        duration: 2250,
        isClosable: true,
        variant: "subtle",
        });
      }
    },
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
            <Box fontSize={'xs'} textColor={'gray.500'} className='ongoingAddedWhen' sx={{position:'absolute', top:'-14px', right:'10px'}}>{day_diff > 0 ? `${day_diff} d ${hr_diff} h`: hr_diff > 0 ? `${hr_diff} h ${min_diff} m`: `${min_diff} m`} ago</Box>
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
                    Are you sure? <strong>You can't undo this action afterwards.</strong> Hidden tasks could be found in the backlog.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Flex direction={'row'} w={'100%'}>
                      <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                      </Button>
                      <Spacer />
                      <Button colorScheme='teal' mr={2} onClick={() => {changeHideMutation(task._id, {hidden: true}); onClose();}}>
                        Hide
                      </Button>
                      <Button colorScheme='red' onClick={() => {onRemove(task._id); onClose();}}>
                        Delete
                      </Button>
                    </Flex>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        )
      }

    function getView(_id:string) {
        window.open(`/view/${_id}`, "_blank") //to open new page;
    }

    return (
        <Box key={task._id} boxShadow='base' p='5' rounded='md' mt='3' mb='3' opacity={task.status === "complete" ? "70%" :"100%"} _dark={{border: "2px solid #718096"}}>
        <Stack direction='row-reverse' sx={{position: 'relative'}}>
            <DeleteTaskDialog />
        </Stack>
        <Stack>
            <HStack>
              <Checkbox isChecked={task.status === 'complete'} size={'xl'} onChange={(e) => changeStatusMutation(task._id, {author: "default", status: e.target.checked ? "complete" : "ongoing"})}> </Checkbox>
              {
                task.link ? <p className='ongoingTitle' onClick={onClickLink}>{task.title}</p>
                          : <p className='ongoingTitle'>{task.title}</p>
              }
            </HStack>
            <HStack wrap='wrap' mt={'.5em'}>
                {task.skills.map((tg, id) => (
                <Tag key={id}>{tg}</Tag>
                ))} <Spacer /> <Tag colorScheme={EXP_MAP.get(task.exp)['colorScheme']}>{task.exp}</Tag>
            </HStack>
        </Stack>
        <Stack direction={'row'} mt={'1em'} gap={'1'} w={'min-content'} border={'1px solid #E2E8F0'} borderRadius={'sm'}>
            <TaskCollectionPopover onSuccess={()=> {
              queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']}); queryClient.invalidateQueries({queryKey: ['fetchCollections']});

              }} task={task} collections={collections}/>
            <TaskEditModal onSuccess={() => { queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']});
            queryClient.invalidateQueries({queryKey: ['fetchSkills']});}} task_id={task._id} className='ongoingEdit'/>
            <IconButton icon={<ViewIcon />} p={'2px'} size={'s'} bgColor={'whiteAlpha.100'} aria-label="viewTask" onClick={() => getView(task._id)} />
        </Stack>
    </Box>
    )
}

export default TaskOngoing;