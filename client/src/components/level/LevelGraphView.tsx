import { VStack } from "@chakra-ui/react"
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
    Legend
  );

const LevelGraphView:React.FC<LevelGraphViewProps> = ({data}) => {
    // sort data descendingly by exp earned
    function compareExp(a:skill, b:skill) {
        return b.exp_earned - a.exp_earned;
    }
    data.sort(compareExp, );

    // take the top 10 skills from data
    data.length > 10 ? data = data.slice(0, 10) : data = data;

    // transform data to fit Chart.js data format
    const chartLables = data.map(d => d._id);
    const chartDataset = data.map(d => d.exp_earned);

    const chartData = {
        labels: chartLables,
        datasets: [
          {
            label: 'exp',
            data: chartDataset,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
          },
        ],
      };

    return (<>
    <VStack justifyContent={'center'}>
        <Radar data={chartData} options={{responsive: true}}/>
    </VStack>
    </>)

}

export default LevelGraphView;