import { useRef, useState } from "react";
import CreateHead from "../../../components/CreateHead/CreateHead";


import { api } from "../../../store/api/api";
import ErrorPages from "../../Error/ErrorPages";
import TaskForm from "../../../components/TaskForm/TaskForm";

interface IProps {
    edit: boolean,
}

function TasksPlan(props: IProps) {
    const { edit } = props;
    const btnSubmitRef = useRef<HTMLInputElement>(null);

    const [sendFormFilters, setSendFormFilters] = useState(false);

    const clickSave = () => {
        if (btnSubmitRef.current) { btnSubmitRef.current.click() }
        setSendFormFilters(true)
    }

    const [createTask, { isError: createError }] = api.useCreateTaskMutation();

    if (createError) return <ErrorPages></ErrorPages>


    return (
        <>
            <CreateHead redirect={false} title={"Карточка задачи"} nameFunc="save" namePage="tasks" saveFunc={clickSave} />
            <TaskForm sendFormFilters={sendFormFilters} funcRequest={createTask}  edit={edit} refBtn={btnSubmitRef} ></TaskForm>


        </>
    )
}
export default TasksPlan