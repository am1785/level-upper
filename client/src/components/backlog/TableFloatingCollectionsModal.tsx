import React, { useState, useEffect } from "react"
import { Text, Button, FormControl, FormLabel, HStack, IconButton, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Stack, Switch, Tag, Textarea, useDisclosure, useToast, Checkbox, VStack } from "@chakra-ui/react"
import { StarIcon, EditIcon, ArrowUpDownIcon } from "@chakra-ui/icons"
import { useQueryClient, UseMutationResult, useMutation, } from "@tanstack/react-query"
import * as backlogApi from "../../api/backlog";

export type TableFloatingCollectionsModalProps = {
    task_ids: string[],
    collections: string[],
}

const TableFloatingCollectionsModal:React.FC<TableFloatingCollectionsModalProps> = ({task_ids, collections}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();
    const queryClient = useQueryClient();

    const { mutate }: UseMutationResult<void, unknown, { _ids: string[], collection: string, op: string }> = useMutation({
        mutationFn: ({ _ids, collection, op }) => backlogApi.editTaskCollections(_ids, collection, op),
        mutationKey: ['editTask'],
        });

        const editTaskCollectionMutation = async (_ids: string[], collection: string, op: string) => {
        await mutate({ _ids, collection, op }, {
            onSuccess: (data, variables, context) => {
                // queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']});
                const opDescription = op === "add_col_to_set" ? `added ${_ids.length} tasks to collection` : `removed ${_ids.length} tasks from collection`
                queryClient.invalidateQueries({queryKey: ['fetchSkills']});
                toast({
                    title: 'success',
                    status: 'success',
                    description: opDescription,
                    duration: 2000,
                    isClosable: true,
                    });
            },
            onError: () => {
                toast({
                    title: 'error',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    });
            }
            // Add other options as needed
        });
        };

    return(<>
        <IconButton onClick={onOpen} colorScheme="yellow" variant={"outline"} bg={"white"} _light={{color:"yellow.400"}} _dark={{bg: "gray.700"}} icon={<StarIcon />} aria-label="add to collection button" />
          <Modal isOpen={isOpen} onClose={() => {queryClient.invalidateQueries({queryKey: ['fetchOngoingTasks']}); onClose();}} isCentered size={'sm'} scrollBehavior={'inside'}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
              add / remove from collections
              </ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                {collections?.map((c:string, id:number) => (
                    <Checkbox aria-label={c} key={id} m={3.5} onChange={(e) => {e.currentTarget.checked ? editTaskCollectionMutation(task_ids, c, "add_col_to_set") : editTaskCollectionMutation(task_ids, c, "pull_col_from")}}>{c}</Checkbox>
                ))}
              </ModalBody>

              <ModalFooter>
              </ModalFooter>
            </ModalContent>
          </Modal>
    </>)
}

export default TableFloatingCollectionsModal;