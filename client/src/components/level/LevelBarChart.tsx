import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LinearScale,
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
    LinearScale,
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

export type LevelBarChartProps = {
    chartData: any;
    variant: string;
}

const LevelBarChart:React.FC<LevelBarChartProps> = ({ chartData, variant}) => {

    return (<>
    {variant === "dark" ?
        <Bar data={chartData}
            options={{
            indexAxis: 'y' as const,
            elements: {
                bar: {
                borderWidth: 2,
                },
            },
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 10
                        },
                    }
                }
            },
            scales:{
                x: {
                    grid: {
                        display: false 
                        },
                    stacked: false
                },
                y: {
                    grid: {
                        display: false 
                        },
                    stacked: false
                }
            },
        }}/> : <Bar data={chartData}
        options={{
        indexAxis: 'y' as const,
        elements: {
            bar: {
            borderWidth: 2,
            },
        },
        scales:{
            x: {
                grid: {
                    display: false 
                    },
                stacked: false
            },
            y: {
                grid: {
                    display: false
                    },
                stacked: false
            }
        },
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        },
    }}/>}
    </>)
}

export default LevelBarChart;