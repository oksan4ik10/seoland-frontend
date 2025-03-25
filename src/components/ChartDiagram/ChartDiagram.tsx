import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import "chart.js/auto";


import {  IPlan } from '../../models/type';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: false,
        },
      },

};


interface IProps {
    dataDiagram: IPlan[]
    bg: string,
    isLine: boolean
}
export function Chart(props: IProps) {
    const { dataDiagram, bg, isLine} = props;

    const data = {
        labels: dataDiagram.map((item)=> item.month),
        datasets: [{
            label: "По плану",
            data: dataDiagram.map((item)=> item.timePlan),
            backgroundColor: bg,
        },
        {
            label: "По факту",
            data: dataDiagram.map((item)=> item.timeFact),
            backgroundColor: "#F2B93A",
        },
        
    ]
    }
    const dataLine = {
        labels: dataDiagram.map((item)=> item.month),
        datasets: [{
            label: "Темп работ",
            data: dataDiagram.map((item)=> item.timeProgress),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            fill: true
        },]
    }
   
    if(!isLine)
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Bar options={options as any} data={data as any} />;
    return <Line options={options} data={dataLine} />;
}
