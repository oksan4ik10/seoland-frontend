import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom'

import { api } from "../../../store/api/api";
import ErrorPages from '../../Error/ErrorPages';

import CreateHead from '../../../components/CreateHead/CreateHead';
import TaskForm from '../../../components/TaskForm/TaskForm';

interface IProps {
    edit: boolean;
    nameFunc: string;
}
function TasksShowEdit(props: IProps) {
    const { id } = useParams();

    const { edit, nameFunc } = props;
    const { data, error, isLoading } = api.useGetTaskQuery(id ? id : "-2");

   const [sendFormFilters, setSendFormFilters] = useState(false);
    const [editTask, { isError: editError }] = api.useEditTaskMutation();

    const btnSubmitRef = useRef<HTMLInputElement>(null)
    const clickSave = () => {
        if (btnSubmitRef.current) { btnSubmitRef.current.click() }
        setSendFormFilters(true)
    }
    if (isLoading) return (<h2>Загрузка данных</h2>)
    if (error || editError || !data) return (<ErrorPages></ErrorPages>)

    return (
        <>
            <CreateHead title="Карточка задачи" redirect={false} nameFunc={nameFunc} saveFunc={clickSave} namePage="tasks" />
            <TaskForm sendFormFilters={sendFormFilters} funcRequest={editTask} data={data} edit={edit} refBtn={btnSubmitRef} id={id} ></TaskForm>
        </>
    )
}

export default TasksShowEdit