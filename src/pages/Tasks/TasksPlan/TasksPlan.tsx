import { useRef } from "react";
import CreateHead from "../../../components/CreateHead/CreateHead";
import { useParams } from 'react-router-dom'

import { api } from "../../../store/api/api";
import ErrorPages from "../../Error/ErrorPages";

import TaskPlanForm from "../../../components/TaskPlanForm/TaskPlanForm";


function TasksPlan() {
    const { id } = useParams();
    const btnSubmitRef = useRef<HTMLInputElement>(null);
    const { data, error, isLoading } = api.useGetTrackingQuery(id ? id : "-2");

    const clickSave = () => {
        if (btnSubmitRef.current) { btnSubmitRef.current.click() }
    }

    const [editTrack, { isError: createError }] = api.useEditTrackMutation();


    if(isLoading) return (<h2>Загрузка данных</h2>)
    if (createError || error) return <ErrorPages></ErrorPages>


    return (
        <>
            <CreateHead redirect={false} title={"Карточка задачи"} nameFunc="save" namePage="tasks" saveFunc={clickSave} />
            {data && id && <TaskPlanForm data={data} id={id}  funcRequest={editTrack}  refBtn={btnSubmitRef} ></TaskPlanForm>}


        </>
    )
}
export default TasksPlan