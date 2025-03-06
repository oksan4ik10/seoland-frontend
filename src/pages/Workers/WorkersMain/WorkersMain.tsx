
import { useState } from "react";
import style from "./WorkersMain.module.css";

import TablePage from "../../../components/TablePage/TablePage";
import { api } from "../../../store/api/api";
import { IParamsAPI } from "../../../store/api/api";



function WorkersMain() {
    const [paramsAPI, setParamsAPI] = useState<IParamsAPI>({
        ordering: ""

    });


    const { data, error, isLoading } = api.useGetWorkersQuery(paramsAPI);


    const [delWorker] = api.useDelWorkerMutation();

    const setParamsFilter = (key: string, value: string | number) => {
        setParamsAPI(() => {
            const obj = Object.assign({}, paramsAPI);
            if (key === "nameSeller") {
                obj["seller"] = value ? value : ""
            } else obj[key] = value

            return obj
        });

    }

    if (isLoading) return (<p>Загрузка данных</p>)
    if (error) return (<p>Ошибка</p>)

        return (data && <TablePage setParamsFilter={setParamsFilter} style={style} nameTable="workers" workers={data} delItem={delWorker} lengthRow={data.length}></TablePage>)
}

export default WorkersMain