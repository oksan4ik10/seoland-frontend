
import { useState } from "react";
import style from "./TasksPage.module.css";

import TablePage from "../../../components/TablePage/TablePage";
import { api } from "../../../store/api/api";
import { IParamsAPI } from "../../../store/api/api";



function TasksPage() {
    const [paramsAPI, setParamsAPI] = useState<IParamsAPI>({

    });


    const { data, error, isLoading } = api.useGetTasksQuery(paramsAPI);
    console.log(data);


    const setParamsFilter = (key: string, value: string | number) => {
        setParamsAPI(() => {
            const obj = Object.assign({}, paramsAPI);

            if (key === "project") {
                obj['IDproject'] = value
            } else obj[key] = value
            return obj
        });

    }



    if (isLoading) return (<p>Загрузка данных</p>)
    if (error) return (<p>Ошибка</p>)

    return (
        data && <TablePage setParamsFilter={setParamsFilter} style={style} nameTable="tasks" tasks={data} lengthRow={data.length}></TablePage>)
}

export default TasksPage