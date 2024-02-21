import React, { FormEvent } from "react";
import { StarIcon } from "@chakra-ui/icons"
import { IconButton, Checkbox, Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, List, ListItem, Skeleton, Portal, Input } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as taskApi from '../../api/tasks';
import { OngoingTask } from "./TaskOngoing";

export type TaskCollectionPopoverProps = {
    task: OngoingTask;
    collections: string[];
}

const TaskCollectionPopover: React.FC<TaskCollectionPopoverProps> = ({task, collections}) => {

    const [newCollection, setNewCollection] = React.useState("");

    const handleSubmit = (event:FormEvent) => {
        event.preventDefault();
        collections = [...collections, newCollection];
        setNewCollection('');
    }

return (<>
    <Popover placement="right">

    <PopoverTrigger>
    {/* <Button size={'xs'} mt={'1.25em'} bgColor={"whiteAlpha.100"}><StarIcon color={task.task_collections ? 'yellow.300' : 'gray.200'}/></Button> */}
    <IconButton p={'2px'} size={'s'} aria-label="favorite" bgColor={'whiteAlpha.100'} icon={<StarIcon stroke={"gray"} strokeWidth={2} color={task.task_collections ? 'yellow.300' : 'white'}/>}></IconButton>
    </PopoverTrigger>

    <Portal>
    <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
            <form onSubmit={(e) => handleSubmit(e)}>
            <Input placeholder="+ new collection" onChange={(e) => {setNewCollection(e.currentTarget.value)}} />
            </form>
        </PopoverHeader>
        <PopoverBody sx={{maxHeight:'25vh', overflowX:'auto'}}>
            <List spacing={3}>
            {collections?.map((collection:any, id:number)  => (
                <ListItem key={id}>
                    <Checkbox /> {collection}
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

