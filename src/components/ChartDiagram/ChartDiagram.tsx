import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import ChartDataLabels from 'chartjs-plugin-datalabels';

import { IDataDiagram } from '../../models/type';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    indexAxis: 'y' as const,
    scales: {
        x: {


            grid: {
                display: false,
            },
            ticks: {
                min: 100000,

                stepSize: 100000,
                font: {
                    family: "Rubik",
                    size: "12px"
                },

            },

        },
        y: {
            display: false,
            grid: {
                display: false,
            },
        },
    },
    plugins: {
        legend: {
            display: false,
            labels: {
                font: {
                    family: "Rubik",
                    size: 14,
                },

            }
        },
        datalabels: {
            align: "end",
            anchor: "end",
            color: '#131313',
            formatter: function (value: string) {
                return `${value} ₽`
            }
            ,
            padding: 0,
            font: {
                family: "Rubik",
                size: "14px"
            },


        }
    },

};



interface IProps {
    dataDiagram: IDataDiagram[]
    bg: string
}
export function Chart(props: IProps) {
    const { dataDiagram, bg } = props;

    const labels: string[] = [];
    const dataSetValues: number[] = [];


    for (let index = 0; index < dataDiagram.length; index++) {
        labels.push(dataDiagram[index].label)
        dataSetValues.push(Number(dataDiagram[index].value))

    }

    const data = {
        labels,
        datasets: [{
            label: "",
            data: dataSetValues,

            stack: "001",

            backgroundColor: bg,


        }]
    }



    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Bar plugins={[ChartDataLabels]} options={options as any} data={data as any} />;
}
