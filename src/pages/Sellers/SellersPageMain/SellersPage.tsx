

import { useState } from "react";
import style from "./SellersPage.module.css";

import TablePage from "../../../components/TablePage/TablePage";
import { api, IParamsAPI } from "../../../store/api/api";


function SellersPage() {
    const [paramsAPI, setParamsAPI] = useState<IParamsAPI>({
        ordering: ""

    });


    const { data: sellersApi, error, isLoading } = api.useFetchAllSellersQuery(paramsAPI);
    const setParamsFilter = (key: string, value: string | number) => {
        setParamsAPI(() => {
            const obj = Object.assign({}, paramsAPI);
            obj[key] = value
            return obj
        });

    }



    if (isLoading) return (<p>Загрузка данных</p>)
    if (error) return (<p>Ошибка</p>)

    return (
        sellersApi && <TablePage style={style} nameTable="sellers" sellers={sellersApi} lengthRow={sellersApi.length} setParamsFilter={setParamsFilter}></TablePage>
    )
}

export default SellersPage