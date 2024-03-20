import { Select, Text, Box, Card, CardBody, CardHeader, HStack, Heading, Stack, StackDivider, VStack, useColorMode } from "@chakra-ui/react"
import { CheckCircleIcon, StarIcon } from "@chakra-ui/icons"
import { skill } from "../home/Mylevel";
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    Colors,
} from 'chart.js';

export type LevelGraphViewProps = {
    data: skill[]
}

  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    Colors
  );

const LevelGraphView:React.FC<LevelGraphViewProps> = ({data}) => {
    // sort data descendingly by exp earned
    const { colorMode, toggleColorMode } = useColorMode();

    function compareExp(a:skill, b:skill) {
        return b.exp_earned - a.exp_earned;
    }
    data.sort(compareExp, );

    // take the top 10 skills from data
    data.length > 10 ? data = data.slice(0, 10) : data = data;

    // transform data to fit Chart.js data format
    const chartLables = data.map(d => d._id);
    const chartDatasetAll = data.map(d => d.exp_earned);
    const totalCompleted =  data.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0);
    const totalExpEarned = data.reduce((a, c) => a + c.exp_earned, 0);

    const chartData = {
        labels: chartLables,
        datasets: [
          {
            label: 'exp',
            data: chartDatasetAll,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            pointBackgroundColor: 'rgba(255, 99, 132, 0.2)',
            pointBorderColor: '#fff',
          },
        ],
      };

    return (<>
    <VStack justifyContent={'center'} rowGap={'2em'}>
        <Card w={"100%"}>
          <CardHeader>
            <Heading size='sm'>level stats</Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing='4'>
                {/* <Heading size='xs' textTransform='uppercase'>
                  Summary
                </Heading> */}

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
              <Heading size='sm' mt={"-1em"}>top skills</Heading>
            </CardHeader>
            {colorMode === "dark" ? <Radar data={chartData}
                  options={{responsive: true,
                    plugins: {
                      legend: {
                          labels: {
                              // This more specific font property overrides the global property
                              font: {
                                  size: 12,
                              },
                          }
                      }
                    },
                    scales: {
                      r: {
                        pointLabels: {
                          color: "white"
                        },
                        grid: {
                          color: "gray.200"
                        },
                        angleLines: {
                          color: "gray"
                        },
                        ticks: {
                          color: 'transparent',
                          backdropColor: 'transparent'
                        }
                      }
                    }
              }}/> : <Radar data={chartData}
              options={{responsive: true,
                plugins: {
                  legend: {
                      labels: {
                          // This more specific font property overrides the global property
                          font: {
                              size: 12,
                          },
                      }
                  }
                },
                scales: {
                  r: {
                    pointLabels: {
                      color: "black"
                    }
                  }
                }
            }}/>
          }
          </CardBody>
        </Card>
    </VStack>
    </>)

}

export default LevelGraphView;