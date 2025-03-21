
import { useState } from "react";
import style from "./ProjectsPage.module.css";

import TablePage from "../../../components/TablePage/TablePage";
import { api } from "../../../store/api/api";
import { IParamsAPI } from "../../../store/api/api";



function ProjectsPage() {
    const [paramsAPI, setParamsAPI] = useState<IParamsAPI>({
        ordering: ""

    });


    const { data, error, isLoading } = api.useGetProjectsQuery(paramsAPI);
    console.log(data);
    
    const setParamsFilter = (key: string, value: string | number) => {
        setParamsAPI(() => {
            const obj = Object.assign({}, paramsAPI);
            if (key === "nameSeller") {

                obj["seller"] = value ? value : ""
            } else obj[key] = value

            return obj
        });

    }

    // const [delProduct] = api.useFetchDelProductMutation();





    if (isLoading) return (<p>Загрузка данных</p>)
    if (error) return (<p>Ошибка</p>)

    return (
        data && <TablePage setParamsFilter={setParamsFilter} style={style} nameTable="projects" projects={data} lengthRow={data.length}></TablePage>)
}

export default ProjectsPage