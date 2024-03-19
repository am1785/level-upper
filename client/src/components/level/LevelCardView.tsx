import { Box, Stack, Card, Text, CardHeader, CardBody, Badge } from "@chakra-ui/react"
import { skill } from "../home/Mylevel";

export type LevelCardViewProps = {
    data: skill[]
}

export default function LevelCardView(prop:LevelCardViewProps){
    const data = prop.data;
      // A compare function to sort data by the exp_earned field descendingly
    function compareExp(a:skill, b:skill) {
        return b.exp_earned - a.exp_earned;
    }

    data.sort(compareExp, );

    return (<>
    {!data || data.length === 0 && <Box boxShadow='md' p='5' rounded='md' bg='white' mt='3' mb='3'>add some tasks to level up today!</Box>}
    <Stack direction={'row'} wrap={'wrap'} spacing={'3'} mt={'1em'} justifyContent={'space-evenly'}>
        {data.map( (s:skill, id:number) => ( // () instead of {} so that something is returned explicitly
                <Card key={id} variant={id % 2 === 0 ? 'outline' : 'filled'}>
                    <CardHeader fontSize={'md'} fontWeight={'600'} _dark={{"color": "yellow.300"}}>{s._id}</CardHeader>
                    <CardBody mt={'-2em'}>
                    <Text fontSize={'sm'}>tasks <Badge backgroundColor={id % 2 === 0 ? '': 'white'} _dark={{"color":"black"}}>{s.count}</Badge></Text>
                    <Text fontSize={'sm'}>exp earned <Badge backgroundColor={id % 2 === 0 ? '': 'white'} _dark={{"color":"black"}}>{s.exp_earned}</Badge></Text>
                    </CardBody>
                </Card>
        ))}
    </Stack>
    </>)

}