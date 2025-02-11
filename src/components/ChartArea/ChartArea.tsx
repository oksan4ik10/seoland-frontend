import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    ScriptableContext,
    TimeScale,
    TimeSeriesScale
} from 'chart.js'
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2'
import "chartjs-adapter-date-fns";

import moment from 'moment'

import { FC } from 'react'
import { IDataDiagram } from '../../models/type'



ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    TimeScale,
    TimeSeriesScale
)

interface IProps {
    dataDiagram: IDataDiagram[]
}

const getDatesArray = (startItem: IDataDiagram, endItem: IDataDiagram) => {
    const start = new Date(startItem.label);
    const end = new Date(endItem.label)
    const arr = [];
    let i = 0;
    while (start < end) {
        const obj = {
            label: "",
            date: new Date(start),
            value: i === 0 ? startItem.value : "0"
        }
        i++;
        arr.push(obj);
        start.setDate(start.getDate() + 1);
    }
    return arr;
};

const AreaChart: FC<IProps> = (props: IProps) => {
    const { dataDiagram } = props

    const options = {
        responsive: true,
        scales: {
            x: {

                grid: {
                    display: false,
                },
                type: 'time',
                time: {
                    unit: 'week'
                },
                ticks: {
                    callback: function (value: Date) {
                        return moment(value).format('DD.MM')
                    },
                    font: {
                        family: "Rubik",
                        size: "12px"
                    },
                }
            },
            y: {
                stacked: true,
                display: false,
                grid: {
                    display: false,
                },

            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    title: function (context: { label: string; }[]) {
                        let title = context[0].label || '';
                        if (title) {
                            const date = title.split(",");
                            title = moment(new Date(`${date[0]} ${date[1]}`)).format('DD.MM.YYYY')
                        }
                        return title;
                    }
                }
            },

        },


    }

    const [dataDiagramWithDate, setDataDiagram] = useState<IDataDiagram[]>([])
    useEffect(() => {

        if (dataDiagram.length === 0 || !dataDiagram) return
        let dataDiagram2: IDataDiagram[] = [];


        for (let index = dataDiagram.length - 1; index >= 1; index--) {
            dataDiagram2 = [...dataDiagram2, ...getDatesArray(dataDiagram[index], dataDiagram[index - 1])];

        }
        dataDiagram2.push({ label: '', date: new Date(dataDiagram[0].label), value: dataDiagram[0].value })


        if (dataDiagram2.length !== 30) {
            const lastItem = new Date(dataDiagram2[dataDiagram2.length - 1].date)
            lastItem.setDate(lastItem.getDate() + 1);
            const newDate = new Date();
            while (lastItem <= newDate) {
                const obj = {
                    label: "",
                    date: new Date(lastItem),
                    value: "0"
                }
                dataDiagram2.push(obj)
                lastItem.setDate(lastItem.getDate() + 1);
            }
        }
        if (dataDiagram2.length !== 30) {
            const firstItem = new Date(dataDiagram2[0].date)
            firstItem.setDate(firstItem.getDate() - 1);
            while (dataDiagram2.length !== 30) {
                const obj = {
                    label: "",
                    date: new Date(firstItem),
                    value: "0"
                }
                dataDiagram2.unshift(obj)
                firstItem.setDate(firstItem.getDate() - 1);
            }
        }

        setDataDiagram(dataDiagram2)

    }, [dataDiagram])




    const values = {
        labels: dataDiagramWithDate.map((item) => item.date),

        datasets: [
            {
                fill: true,
                label: 'Сумма',
                borderColor: 'rgba(255, 99, 132, 0)',
                data: dataDiagramWithDate.map((item) => Number(item.value)),
                backgroundColor: (context: ScriptableContext<'line'>) => {
                    const ctx = context.chart.ctx
                    const gradient = ctx.createLinearGradient(0, 0, 0, 180)
                    gradient.addColorStop(0, '#F23A90')
                    gradient.addColorStop(1, '#D4E0FA')
                    return gradient
                },

            },
        ],
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Line options={options as any} data={values as any} />
}

export default AreaChart