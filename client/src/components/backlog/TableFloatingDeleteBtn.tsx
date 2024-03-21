import React from "react"
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, IconButton, useDisclosure } from "@chakra-ui/react"
import { DeleteIcon } from "@chakra-ui/icons"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as backlogApi from "../../api/backlog";

export type TableFloatingDeleteBtnProps = {
    task_ids: string[],
    onSuccess: () => void
}

const TableFloatingDeleteBtn:React.FC<TableFloatingDeleteBtnProps> = ({task_ids, onSuccess}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef(null);
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: (_ids:string[]) => backlogApi.deleteTasks(_ids),
        mutationKey: ['bulkDeleteTasks'],
      });

      const bulkRemoveTaskMutation = async (_ids:string[]) =>
        await mutate(_ids, {
          onSuccess(data, variables, context) {
            queryClient.invalidateQueries({queryKey: ['bulkDeleteTasks']});
            queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']});
            queryClient.invalidateQueries({queryKey: ['fetchSkills']});
            onSuccess();
          },
        })
    return (
      <>
        <IconButton colorScheme="red" variant={"outline"} bg={"white"} _dark={{bg: "gray.700"}} icon={<DeleteIcon />} aria-label="delete button" onClick={onOpen} />
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          size={'sm'}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete Task:
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme='red' ml={2} onClick={() => { bulkRemoveTaskMutation(task_ids); onClose();}}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }

  export default TableFloatingDeleteBtn;