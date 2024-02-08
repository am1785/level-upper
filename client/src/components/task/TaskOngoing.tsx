import React, {useState} from 'react'
import { Checkbox, Center, Box, Tag, HStack, Stack, Spacer, Button, IconButton, useDisclosure } from "@chakra-ui/react"
import { MinusIcon } from "@chakra-ui/icons"
import { AlertDialog,AlertDialogBody,AlertDialogFooter, AlertDialogHeader,AlertDialogContent,AlertDialogOverlay} from '@chakra-ui/react'

export type OngoingTask = {
    id: number;
    title: string;
    link?: string;
    content?: string;
    tags: string[];
    status: number; // ongoing = 0, backlog = -1, completed = 1
    exp: number;
    recurring: boolean;
    author: string;
}

export type OngoingTaskProps = {
    task: OngoingTask;
    onRemove: (id: number) => void;
    onExpand: (id: number) => void;
}

const TaskOngoing: React.FC<OngoingTaskProps> = ({task, onRemove, onExpand}) => {

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

    return (<>
        <Box key={task.id} boxShadow='base' p='5' rounded='md' bg='white' mt='3' mb='3' backdropFilter='auto' backdropContrast='30%'>
        <Stack direction='row-reverse' sx={{position: 'relative'}}>
            <DeleteTaskDialog />
        </Stack>
        <Stack>
            <HStack>
              <Checkbox size={'xl'}> </Checkbox>
              <p className='ongoingTitle'>{task.title}</p>
            </HStack>
            <HStack wrap='wrap' mt={'.5em'}>
                {task.tags.map((tg, id) => (
                <Tag key={id}>{tg}</Tag>
                ))} <Spacer /> <Tag>{task.exp}</Tag>
            </HStack>
        </Stack>
        <Center>
          <Button mt={'1em'} mb={'-.25em'} h={"1.25em"} w={"75%"} aria-label='expand task' onClick={()=> {onExpand(task.id);}}>...</Button>
        </Center>
    </Box>
    {/* {editing && } */}

    </>)
}

export default TaskOngoing;