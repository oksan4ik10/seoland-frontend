/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FixedSizeList } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import moment from "moment";


import Pages from "../../components/PagesHead/PagesHead";
import { api } from "../../store/api/api";
import Filter from "../../components/Filter/Filter";



import styles from "./Homepage.module.css"
import {  IPlan } from "../../models/type";
// import { Chart } from "../../components/ChartDiagram/ChartDiagram";
// import AreaChart from "../../components/ChartArea/ChartArea";

import { ExportReactCSV } from "../../components/ExportReactCSV/ExportReactCSV"




interface IPropRow {
    data: IPlan[];
    index: number;
    style: React.CSSProperties;
}
const Row = (dataTabel: IPropRow) => {
    const { data, index, style } = dataTabel;

    const item = data[index];
    return (
        <div className={styles.rowWrapper} style={style} key={index}>


            <div className={"row " + styles.row + " " + styles.rowItem} >
                <div className={"col "}>
                    {item.month}

                </div>
                <div className={"col "}>
                    {item.countWorkers}
                </div>
                <div className={"col "}>
                    {item.timePlan}
                </div>
                <div className={"col "}>
                    {item.timeFact}
                </div>
                <div className={"col "}>
                    {(item.timeFact / item.timePlan * 100) + " %"}
                </div>
                <div className={"col "}>
                    {item.FOTfact}
                </div>
                <div className={"col "}>
                    {item.FOTplan}
                </div>



            </div>
        </div>
    );

}



function HomePage() {

    const [valuesFilter, setValuesFilter] = useState({project: "65ce28d8f77a1d1b3454f0d1"})

    const { data: dataFilters, error: errorFilter, isLoading: isLoadingFilter } = api.useGetProjectsQuery({});
    const { data, error, isLoading } = api.useGetAnalyticQuery(valuesFilter.project);

    const filtersData = {
        title: "Проекты",
        nameFilter: "project",
        project: dataFilters ? dataFilters.map((item) => ({ name: item.name, id: item.id })) : [],
        id: true
    
    }

    const setParamsFilter = (_: "project", value: string) => {
        valuesFilter.project = value;
        setValuesFilter(valuesFilter)
    }

    if (isLoading || isLoadingFilter ) return (<p>Загрузка данных</p>)
    if (error || errorFilter ) return (<p>Ошибка</p>)


    return (
        <>


            <div className="tabel">
                <Pages title={"Аналитика"} />
                <div className={"head__filters " + styles.head__filters} >

                    <Filter data={filtersData} setParamsFilter={setParamsFilter as any}></Filter>

                </div>

                {data && data.data.length > 0 && <div className={"tables " + styles.tables}>
                    <div className={"row row__title " + styles.row + " " + styles.row__title}>
                        <div className="col__title ">
                            Дата
                        </div>
                        <div className="col__title ">
                            Сотрудники
                        </div>
                        <div className="col__title ">
                            Часы план
                        </div>
                        <div className="col__title ">
                            Часы факт
                        </div>
                        <div className="col__title ">
                            Часы %
                        </div>
                        <div className="col__title ">
                            ФОТ план
                        </div>
                        <div className="col__title ">
                            ФОТ факт
                        </div>

                        <div className={styles.excel}>
                            {data && <ExportReactCSV csvData={data.data} fileName={moment(Date.now()).format("DD-MM-YYYY")}></ExportReactCSV>}
                        </div>
                    </div>
                    <div className={styles.dataTable}>
                        <AutoSizer>
                            {({ height, width }) => (
                                <FixedSizeList
                                    className={"tables__wrapper scroll__elem "}
                                    height={height}
                                    itemCount={data.data.length}
                                    itemSize={80}

                                    itemData={data.data}
                                    width={width}
                                >
                                    {Row}
                                </FixedSizeList>
                            )}
                        </AutoSizer>
                    </div>


                </div>}
            </div>

        </>
    )
}

export default HomePage