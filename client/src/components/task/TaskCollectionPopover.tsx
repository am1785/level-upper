import React, { FormEvent } from "react";
import { StarIcon, PlusSquareIcon } from "@chakra-ui/icons"
import { Text, IconButton, Checkbox, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, List, ListItem, Skeleton, Portal, Input, HStack, useToast } from "@chakra-ui/react";
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import * as taskApi from '../../api/tasks';
import { OngoingTask } from "./TaskOngoing";
import { color } from "framer-motion";

export type TaskCollectionPopoverProps = {
    task: OngoingTask;
    collections: string[];
    onSuccess: () => void;
}

type TaskId = string;
type TaskUpdate = any;

const TaskCollectionPopover: React.FC<TaskCollectionPopoverProps> = ({task, collections, onSuccess}) => {

    const [newCollection, setNewCollection] = React.useState("");
    const [collectData, setCollectData] = React.useState(collections);
    const [isActive, setIsActive] = React.useState(true);
    const toast = useToast();

    const { mutate }: UseMutationResult<void, unknown, { _id: TaskId; update: TaskUpdate }> = useMutation({
        mutationFn: ({ _id, update }) => taskApi.editTask(_id, update),
        mutationKey: ['editTask'],
        });

        const editTaskMutation = async (_id: TaskId, update: TaskUpdate) => {
        await mutate({ _id, update }, {
            onSuccess: (data, variables, context) => {
                toast({
                    title: 'success',
                    status: 'success',
                    duration: 1250,
                    isClosable: true,
                    });
                onSuccess();
            },
            onError: () => {
                toast({
                    title: 'error',
                    status: 'error',
                    duration: 1250,
                    isClosable: true,
                    });
            }
            // Add other options as needed
        });
        };

        const addToCollection = (task_id: string, collection:string) => {
            editTaskMutation(task_id, {task_collection: Array.from(new Set([...task.task_collection || [], collection]))}); // TODO: clean up duplicate value issue, state management
        }

        const removeFromCollection = (task_id:string, collection:string) => {
            editTaskMutation(task_id, {task_collection: (task.task_collection || []).filter((c) => !(c.includes(collection)))});
        }

    const handleSubmit = (event:FormEvent) => {
        // append new collection name to list and disable input for 3 seconds
        event.preventDefault();
        setIsActive((prev) => !prev)
        newCollection.length > 0 ? setCollectData( prev => Array.from(new Set([...prev, newCollection]))): null;
        setNewCollection('');
        setTimeout(() => {
            setIsActive((prev) => !prev)
        }, 3000);
    }

return (<>
    <Popover isLazy placement="auto">

    <PopoverTrigger>
    {/* <Button size={'xs'} mt={'1.25em'} bgColor={"whiteAlpha.100"}><StarIcon color={task.task_collections ? 'yellow.300' : 'gray.200'}/></Button> */}
    <IconButton p={'2px'} size={'s'} aria-label="favorite" bgColor={'whiteAlpha.100'} icon={<PlusSquareIcon stroke={"white"} strokeWidth={2} color={task.task_collection.length > 0 ? 'yellow.400' : 'gray.500'} _dark={{color: task.task_collection.length > 0 ? 'yellow.200' : 'white'}}/>}></IconButton>
    </PopoverTrigger>

    <Portal>
    <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
            <form onSubmit={(e) => {setNewCollection(''); handleSubmit(e);}}>
            <Input disabled={!isActive} type="text" maxLength={45} mt={'1.25em'} placeholder="+ new collection" value={newCollection} onChange={(e) => {setNewCollection(e.currentTarget.value)}} />
            </form>
        </PopoverHeader>
        <PopoverBody sx={{maxHeight:'25vh', overflowX:'auto'}}>
            <List spacing={3}>
            {collectData?.map((collection:string, id:number)  => (
                <ListItem key={id}>
                    <Checkbox defaultChecked={task.task_collection?.includes(collection)} size={'md'}
                    onChange={(e) => {
                        // console.log(task);
                        // console.log(task.task_collection);
                        e.target.checked ? addToCollection(task._id, collection) : removeFromCollection(task._id, collection);
                    }}>{collection}</Checkbox>
                </ListItem>
            ))}

            </List>

        </PopoverBody>
    </PopoverContent>
    </Portal>
    </Popover>
</>)
}

export default TaskCollectionPopover;

