import { useState } from "react";
import { FixedSizeList } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import moment from "moment";


import Pages from "../../components/PagesHead/PagesHead";
import { davDamerAPI } from "../../store/api/DavdamerAPI";
import Filter from "../../components/Filter/Filter";



import styles from "./Homepage.module.css"
import { IDataAnalyticsAPI } from "../../models/type";
import { Chart } from "../../components/ChartDiagram/ChartDiagram";
import AreaChart from "../../components/ChartArea/ChartArea";

import { ExportReactCSV } from "../../components/ExportReactCSV/ExportReactCSV"

interface IParamsFilter {
    [key: string]: string
}



interface IPropRow {
    data: IDataAnalyticsAPI[];
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
                    {item.order ? String(item.order) : ""}

                </div>
                <div className={"col "}>
                    {item.davdamer ? item.davdamer : "не заполнено"}
                </div>
                <div className={"col "}>
                    {item.seller ? item.seller : "не заполнено"}
                </div>
                <div className={"col "}>
                    {item.city ? item.city : "не заполнено"}
                </div>
                <div className={"col "}>
                    {item.market ? item.market : "не заполнено"}
                </div>
                <div className={"col "}>
                    {item.category ? item.category : "не заполнено"}
                </div>
                <div className={"col "}>
                    {item.sub_category ? item.sub_category : "не заполнено"}
                </div>
                <div className={"col "}>
                    {item.order_dt ? moment(item.order_dt).format("DD.MM.YYYY") : "не заполнено"}
                </div>
                <div className={"col "}>
                    {item.unit_price + " ₽"}
                </div>
                <div className={"col "}>
                    {item.quantity}
                </div>


            </div>
        </div>
    );

}



function HomePage() {

    const [valuesFilter, setValuesFilter] = useState<{ [key: string]: string }>({
        category: "",
        city: "",
        davdamer: "",
        market: "",
        seller: "",
        sub_category: ""
    })

    const { data: dataFilters, error: errorFilter, isLoading: isLoadingFilter } = davDamerAPI.useGetFiltersAnalyticsQuery();
    const { data, error, isLoading } = davDamerAPI.useGetDataAnalyticsQuery(valuesFilter);
    const { data: diagramDavdamer, error: errorDavdamer, isLoading: isLoadingDavdamer } = davDamerAPI.useGetDataDiagramDavdamerQuery(valuesFilter)
    const { data: diagramSeller, error: errorSeller, isLoading: isLoadingSeller } = davDamerAPI.useGetDataDiagramSellerQuery(valuesFilter)
    const { data: diagramDate, error: errorDate, isLoading: isLoadingDate } = davDamerAPI.useGetDataDiagramDaysQuery(valuesFilter)
    const filtersData = {
        category: {
            title: "Категория",
            nameFilter: "category",
            category: dataFilters ? dataFilters.category.map((item) => ({ name: item.label, id: item.id })) : [],
            id: true
        },
        city: {
            title: "Город",
            nameFilter: "city",
            city: dataFilters ? dataFilters.city.map((item) => ({ name: item.label, id: item.id })) : [],
            id: true
        },
        davdamer: {
            title: "Давдамер",
            nameFilter: "davdamer",
            davdamer: dataFilters ? dataFilters.davdamer.map((item) => ({ name: item.label, id: item.id })) : [],
            id: true
        },
        market: {
            title: "Рынок",
            nameFilter: "market",
            market: dataFilters ? dataFilters.market.map((item) => ({ name: item.label, id: item.id })) : [],
            id: true
        },
        seller: {
            title: "Продавец",
            nameFilter: "seller",
            seller: dataFilters ? dataFilters.seller.map((item) => ({ name: item.label, id: item.id })) : [],
            id: true
        },
        sub_category: {
            title: "Подкатегория",
            nameFilter: "sub_category",
            sub_category: dataFilters ? dataFilters.sub_category.map((item) => ({ name: item.label, id: item.id })) : [],
            id: true
        },
    }

    const setParamsFilter = (key: string, value: string) => {
        const obj: IParamsFilter = Object.assign({}, valuesFilter)
        obj[key] = value;
        setValuesFilter(obj)
    }


    const [keyFilters, setKeyFilters] = useState(0);

    const cancelFilters = () => {
        setValuesFilter({
            category: "",
            city: "",
            davdamer: "",
            market: "",
            seller: "",
            sub_category: ""
        })
        setKeyFilters(keyFilters + 1)
    }

    if (isLoading || isLoadingFilter || isLoadingDavdamer || isLoadingSeller || isLoadingDate) return (<p>Загрузка данных</p>)
    if (error || errorFilter || errorDavdamer || errorSeller || errorDate) return (<p>Ошибка</p>)


    return (
        <>


            <div className="tabel">
                <Pages title={"Аналитика"} />
                <div className={"head__filters " + styles.head__filters} key={keyFilters}>

                    <Filter data={filtersData.davdamer} setParamsFilter={setParamsFilter}></Filter>
                    <Filter data={filtersData.seller} setParamsFilter={setParamsFilter}></Filter>
                    <Filter data={filtersData.city} setParamsFilter={setParamsFilter}></Filter>
                    <Filter data={filtersData.market} setParamsFilter={setParamsFilter}></Filter>
                    <Filter data={filtersData.category} setParamsFilter={setParamsFilter}></Filter>
                    <Filter data={filtersData.sub_category} setParamsFilter={setParamsFilter}></Filter>


                </div>
                {data && data.length > 0 && <div className={styles.charts}>
                    <div className={styles.chartItem}>
                        <h3 className={styles.chartTitle}>Заказы</h3>
                        {diagramDate && <AreaChart dataDiagram={diagramDate} ></AreaChart>}
                    </div>
                    <div className={styles.chartItem}>
                        <h3 className={styles.chartTitle}>Сумма продаж по давдамерам</h3>
                        {diagramDavdamer && <Chart dataDiagram={diagramDavdamer} bg={"#5A719D"}></Chart>}
                    </div>
                    <div className={styles.chartItem}>
                        <h3 className={styles.chartTitle}>Сумма продаж по продавцам</h3>
                        {diagramSeller && <Chart dataDiagram={diagramSeller} bg={"#F2B93A"}></Chart>}
                    </div>
                </div>}
                {data && data.length === 0 && <p className={styles.text}>Данные не найдены. <span onClick={cancelFilters}>Сбросить фильтры</span></p>}
                {data && data.length > 0 && <div className={"tables " + styles.tables}>
                    <div className={"row row__title " + styles.row + " " + styles.row__title}>
                        <div className="col__title ">
                            №<br />заказа
                        </div>
                        <div className="col__title ">
                            Давдамер
                        </div>
                        <div className="col__title ">
                            Продавец
                        </div>
                        <div className="col__title ">
                            Город
                        </div>
                        <div className="col__title ">
                            Рынок
                        </div>
                        <div className="col__title ">
                            Категория
                        </div>
                        <div className="col__title ">
                            Подкатегория
                        </div>
                        <div className="col__title ">
                            Дата
                        </div>
                        <div className="col__title ">
                            Сумма заказа
                        </div>
                        <div className="col__title ">
                            Кол-во,<br />шт
                        </div>
                        <div className={styles.excel}>
                            {data && <ExportReactCSV csvData={data} fileName={moment(Date.now()).format("DD-MM-YYYY")}></ExportReactCSV>}
                        </div>
                    </div>
                    <div className={styles.dataTable}>
                        <AutoSizer>
                            {({ height, width }) => (
                                <FixedSizeList
                                    className={"tables__wrapper scroll__elem "}
                                    height={height}
                                    itemCount={data.length}
                                    itemSize={80}

                                    itemData={data}
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