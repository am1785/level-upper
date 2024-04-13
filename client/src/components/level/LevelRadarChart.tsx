import React from 'react';
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
    Title,
    BarElement,
    CategoryScale,
} from 'chart.js';

ChartJS.register(
    RadialLinearScale,
    CategoryScale,
    PointElement,
    LineElement,
    BarElement,
    Filler,
    Tooltip,
    Legend,
    Colors,
    Title
  );

export type LevelRadarChartProps = {
    chartData: any;
    variant: string;
}

const LevelRadarChart:React.FC<LevelRadarChartProps> = ({ chartData, variant}) => {

    return (<>
    {variant === "dark" ?
                <Radar data={chartData}
                  options={{responsive: true,
                    plugins: {
                      legend: {
                        display: false,
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
                      display: false
                  }
                },
                scales: {
                  r: {
                    pointLabels: {
                      color: "black"
                    }
                  }
                }
            }}/>}
    </>)
}

export default LevelRadarChart;