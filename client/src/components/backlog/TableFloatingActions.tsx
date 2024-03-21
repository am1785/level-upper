import React from "react";
import { Center, Fade, useDisclosure, HStack, IconButton } from '@chakra-ui/react'
import { StarIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import TaskEditModal from "../task/TaskEditModal";
import TableFloatingDeleteBtn from "./TableFloatingDeleteBtn";

export type TableFloatingActionsProps = {
    actionIds: string[],
    prevIdsLength: number,
    onEditSuccess: () => void, // to pass in query invalidate from parent element
    onDeleteSuccess: () => void, // clear selected state from parent element
}

const TableFloatingActions: React.FC<TableFloatingActionsProps> = ({actionIds, prevIdsLength, onEditSuccess, onDeleteSuccess}) => {

    const { isOpen, onToggle } = useDisclosure();

    // toggle open logic
    React.useEffect(()=> {
        if (prevIdsLength === 0 && actionIds.length > 0) {
            onToggle();
        } else if (prevIdsLength > 0 && actionIds.length === 0) {
            onToggle();
        }
    }, [actionIds]);

    function getView(_id:string) {
        window.open(`/view/${_id}`, "_blank") //to open new page;
    }

    return (<>
    {isOpen && <Fade in={isOpen}>
        <Center
          p='40px'
          color='white'
          mt='4'
          bg='gray.50'
          rounded='md'
          shadow='md'
          w={ actionIds.length === 1 ? "14em" : "8em"}
          h={"2em"}
          style={{ position: "absolute", left: 0, right: 0, top: -100, bottom: 0, margin: "auto"}}
          _dark={{bg: "gray.900"}}
        >
          <HStack gap={2}>
            {actionIds.length === 1 && <IconButton colorScheme="teal" variant={"outline"} bg={"white"} _dark={{bg: "gray.700"}} icon={<ViewIcon />} aria-label="View button" 
            onClick={() => getView(actionIds[0])}/> }
            <IconButton colorScheme="yellow" variant={"outline"} bg={"white"} _light={{color:"yellow.400"}} _dark={{bg: "gray.700"}} icon={<StarIcon />} aria-label="add to collection button" />
            {actionIds.length === 1 && <TaskEditModal task_id={actionIds[0]} className="logEdit" onSuccess={onEditSuccess}/> }
            <TableFloatingDeleteBtn task_ids={actionIds} onSuccess={onDeleteSuccess}/>
          </HStack>
        </Center>
    </Fade>}
    </>)
}

export default TableFloatingActions;