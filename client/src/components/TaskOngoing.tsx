import React from 'react'
import { Box, Tag, HStack, Stack, Spacer, Button, IconButton, useDisclosure } from "@chakra-ui/react"
import { MinusIcon } from "@chakra-ui/icons"
import { AlertDialog,AlertDialogBody,AlertDialogFooter, AlertDialogHeader,AlertDialogContent,AlertDialogOverlay} from '@chakra-ui/react'


export type OngoingTask = {
    id: number;
    title: string;
    link?: string;
    content?: string;
    tags: string[];
    created: number; // > 0
    completed: number; // ongoing = 0, unstarted < 0, completed > 0
    exp: number;
}

export type OngoingTaskProps = {
    task: OngoingTask;
    onRemove: (id: number) => void;
}

const TaskOngoing: React.FC<OngoingTaskProps> = ({task, onRemove}) => {
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
                    <Button colorScheme='red' onClick={() => {onRemove(task.id); onClose();}} ml={2}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        )
      }

    return (
        <Box key={task.id} boxShadow='base' p='5' rounded='md' bg='white' mt='3' mb='3'>
        <Stack direction='row-reverse' sx={{position: 'relative'}}>
            <DeleteTaskDialog />
        </Stack>
        <Stack>
            <p className='ongoingTitle'>{task.title}</p>
            <HStack wrap='wrap'>
                {task.tags.map((tg, id) => (
                <Tag key={id}>{tg}</Tag>
                ))} <Spacer /> <Tag>{task.exp}</Tag>
            </HStack>
        </Stack>
    </Box>
    )
}

export default TaskOngoing;