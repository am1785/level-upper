import { Flex } from "@chakra-ui/react"
import TaskTable from '../backlog/TaskTable';

export default function Backlog(){

    return (
        <Flex justify={'center'}>
            <TaskTable />
        </Flex>
    )

}