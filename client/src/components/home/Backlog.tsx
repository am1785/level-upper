
import { Flex } from '@chakra-ui/react';
import TaskTable from '../backlog/TaskTable';
import { userData } from './Ongoing';

type BacklogProps = {
userData: userData
}

const Backlog: React.FC<BacklogProps> = ({userData}) => {
    // const { status:userDataStatus, data: userData, error:userDataError } = useAuthData();
    return (<>
    <Flex justify={'center'}>
        <TaskTable userData={userData}/>
    </Flex>
    </>)
}

export default Backlog;