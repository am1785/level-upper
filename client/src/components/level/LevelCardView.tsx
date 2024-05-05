import { Box, Stack, Card, Text, CardHeader, CardBody, Badge, SlideFade, VStack } from "@chakra-ui/react"
import { skill } from "../home/Mylevel";
import { CheckCircleIcon, StarIcon } from "@chakra-ui/icons";
import { EXP_MAP } from "../backlog/TaskTable";

export type LevelCardViewProps = {
    data: skill[];
}

export default function LevelCardView(prop:LevelCardViewProps){

    const data = prop.data;
      // A compare function to sort data by the exp_earned field descendingly
    function compareExp(a:skill, b:skill) {
        return b.exp_earned - a.exp_earned;
    }

    data.sort(compareExp, );

    return (<>
    {!data || data.length === 0 && <SlideFade in={true} offsetY='20px' delay={1}>
        <VStack justifyContent={'center'}>
        <Card variant={"outline"} borderWidth={1} w={200}>
            <CardHeader fontSize={'md'} fontWeight={'600'} _dark={{"color": "white"}}>add a skill</CardHeader>
            <CardBody mt={'-2em'}>
            <Text fontSize={'sm'}>level up today <CheckCircleIcon color={'green.400'} fontSize={'sm'} m={'.25em'}/></Text>
            </CardBody>
        </Card>
        </VStack>
    </SlideFade>}
    <Stack direction={'row'} wrap={'wrap'} spacing={'3'} justifyContent={'space-evenly'}>
        {data.map( (s:skill, id:number) => { // () instead of {} so that something is returned explicitly
                const CARD_COLOR = s.exp_earned <= 19 ? "#EDF2F7" : s.exp_earned >= 20 && s.exp_earned <= 39 ? "#90cdf4" : s.exp_earned >= 40 && s.exp_earned <= 79 ? "#81E6D9": s.exp_earned >= 80 && s.exp_earned <= 159 ? "#F6AD55" : "#D6BCFA";
                return <SlideFade key={id} in={true} offsetY='20px' delay={.40 - (1 / (id+3))}>
                    <Card variant={"outline"}
                    borderColor={CARD_COLOR}
                    borderWidth={2} boxShadow={s.exp_earned >= 40 ? "0px 0px 8px 1px " + CARD_COLOR: "sm"}>
                        <CardHeader fontSize={'md'} fontWeight={'600'} _dark={{"color": "white"}}>{s._id}</CardHeader>
                        <CardBody mt={'-2em'}>
                        <Text fontSize={'sm'}><CheckCircleIcon color={'green.400'} fontSize={'sm'} m={'.25em'}/> <Badge>{s.count}</Badge></Text>
                        <Text fontSize={'sm'}><StarIcon color={'yellow.400'} fontSize={'sm'} m={'.25em'}/><Badge>{s.exp_earned}</Badge></Text>
                        </CardBody>
                    </Card>
                </SlideFade>
})}
    </Stack>
    </>)

}