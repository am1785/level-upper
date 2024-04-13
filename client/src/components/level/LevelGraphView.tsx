import { Text, Card, CardBody, CardHeader, HStack, Heading, Stack, StackDivider, VStack, useColorMode } from "@chakra-ui/react"
import { CheckCircleIcon, StarIcon } from "@chakra-ui/icons"
import { skill } from "../home/Mylevel";
import LevelRadarChart from "./LevelRadarChart";
import LevelBarChart from "./LevelBarChart";

export type LevelGraphViewProps = {
    skillData: skill[];
    taskSizeData: any[];
}

const LevelGraphView:React.FC<LevelGraphViewProps> = ({skillData, taskSizeData}) => {
    // sort data descendingly by exp earned
    const { colorMode, toggleColorMode } = useColorMode();
    // console.log(data);
    function compareExp(a:skill, b:skill) {
        return b.exp_earned - a.exp_earned;
    }
    skillData.sort(compareExp, );

    // take the top 10 skills from data
    skillData.length > 10 ? skillData = skillData.slice(0, 10) : skillData = skillData;

    // transform data to fit Chart.js radar chart data format
    const radialChartLables = skillData.map(d => d._id);
    const radialChartData = skillData.map(d => d.exp_earned);

    const radialChartDataset = {
      labels: radialChartLables,
      datasets: [
        {
          label: 'exp',
          data: radialChartData,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          pointBackgroundColor: 'rgba(255, 99, 132, 0.2)',
          pointBorderColor: '#fff',
        },
      ],
    };

    // transform data to fit bar chart data format
    const barChartLabels = ['xs', 's', 'm', 'l', 'xl'];
    let barChartData = [0, 0, 0, 0, 0];

    for(let i = 0; i < taskSizeData.length; i++){
      switch(taskSizeData[i]["_id"]) {
        case 1:
          barChartData[0] += taskSizeData[i]["count"]; break;
        case 2:
          barChartData[1] += taskSizeData[i]["count"]; break;
        case 4:
          barChartData[2] += taskSizeData[i]["count"]; break;
        case 8:
          barChartData[3] += taskSizeData[i]["count"]; break;
        case 12:
          barChartData[4] += taskSizeData[i]["count"]; break;
        default:
          // execute no code if no match
      }
    }
    const barChartDataset = {
      labels: barChartLabels,
      datasets: [
        {
          label: 'count',
          data: barChartData,
          backgroundColor: ['rgba(201, 203, 207, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)','rgba(255, 159, 64, 0.2)', 'rgba(153, 102, 255, 0.2)'],
          borderColor: ['rgb(201, 203, 207)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)', 'rgb(255, 159, 64)', 'rgb(153, 102, 255)'],
        },
      ],
    };

    const totalCompleted =  taskSizeData.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0);
    const totalExpEarned = taskSizeData.reduce((a, c) => a + c.count * c._id, 0);

    return (<>
    <VStack justifyContent={'center'} rowGap={'2em'}>
        <Card w={"100%"}>
          <CardHeader>
            <Heading size='sm'>level stats</Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing='4'>
                <HStack justifyContent={'center'}>
                  <Text pt='2' fontSize='sm' color={'gray.500'}>
                    <CheckCircleIcon color={'green.400'} fontSize={'lg'} m={'.5em'}/> tasks solved
                  </Text>
                  <Text fontSize={"md"} fontWeight={"semibold"}>{totalCompleted}</Text>
                </HStack>
                <HStack justifyContent={'center'}>
                  <Text pt='2' fontSize='sm' color={'gray.500'}>
                  <StarIcon color={'yellow.400'} fontSize={'lg'} m={'.5em'}/> exp earned
                  </Text>
                  <Text fontSize={"md"} fontWeight={"semibold"}>{totalExpEarned}</Text>
                </HStack>
            </Stack>
          </CardBody>
        </Card>
        <Card w={'100%'}>
          <CardBody>
            <CardHeader>
              <Heading size='sm' mt={"-1em"}>task completion</Heading>
            </CardHeader>
            {colorMode === "dark" ? <LevelBarChart chartData={barChartDataset} variant="dark" />
                                  : <LevelBarChart chartData={barChartDataset} variant="light"/>}
          </CardBody>
        </Card>
        <Card w={'100%'}>
          <CardBody>
            <CardHeader>
              <Heading size='sm' mt={"-1em"}>top skills</Heading>
            </CardHeader>
            {colorMode === "dark" ? <LevelRadarChart chartData={radialChartDataset} variant="dark" />
                                  : <LevelRadarChart chartData={radialChartDataset} variant="light"/>}
          </CardBody>
        </Card>
    </VStack>
    </>)

}

export default LevelGraphView;