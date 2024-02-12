import {CheckCircleIcon} from '@chakra-ui/icons';
import { Tag, Box, Stack, Card, Text, CardHeader, CardBody } from "@chakra-ui/react"
import * as skillsApi from '../../api/skills';
import { useQuery } from '@tanstack/react-query';

export type skill = {
    _id:string, // name of skill
    count:number,
    exp_earned:number
};

export default function Mylevel(){

    const user = 'default';

    const { status, data, error } = useQuery({
        queryFn: () => skillsApi.fetchSkills(user),
        queryKey: ['fetchSkills', { user }],
      })

      if (status === 'pending') {
        return <span>Loading...</span>
      }

      else if (status === 'error') {
        return <span>Error: {error.message}</span>
      }

      else { // or status === 'success'
        // console.log(data);
      }

      // A compare function to sort data by the exp_earned field descendingly
    function compareExp(a:skill, b:skill) {
        return b.exp_earned - a.exp_earned;
    }

    data.sort(compareExp, );

    return (<>
    <main>
    {!data || data.length === 0 && <Box boxShadow='md' p='5' rounded='md' bg='white' mt='3' mb='3'>add some tasks to level up today!</Box>}
    <Stack direction={'row'} wrap={'wrap'} spacing={'3'} mt={'1em'} justifyContent={'space-evenly'}>
        {data.map( (s:skill, id:number) => ( // () instead of {} so that something is returned explicitly
                <Card key={id} variant={id % 2 === 0 ? 'outline' : 'filled'}>
                    <CardHeader fontSize={'md'} fontWeight={'600'}>{s._id}</CardHeader>
                    <CardBody mt={'-2em'}>
                    <Text fontSize={'sm'}>tasks <CheckCircleIcon /><Tag backgroundColor={id % 2 === 0 ? '': 'white'}>{s.count}</Tag></Text>
                    <Text fontSize={'sm'}>exp earned <Tag backgroundColor={id % 2 === 0 ? '': 'white'}>{s.exp_earned}</Tag></Text>
                    </CardBody>
                </Card>
        ))}
    </Stack>
    </main>
    </>)

}