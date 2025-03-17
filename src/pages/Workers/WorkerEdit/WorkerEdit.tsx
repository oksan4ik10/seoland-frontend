import { useRef } from 'react';
import { useParams } from 'react-router-dom'

import { api } from "../../../store/api/api";

import CreateHead from '../../../components/CreateHead/CreateHead';

import ErrorPages from '../../Error/ErrorPages';
import WorkerForm from '../../../components/WorkerForm/WorkerForm';


function WorkerEdit() {
    const { id } = useParams();
    const btnSubmitRef = useRef<HTMLInputElement>(null)

    if (!id) return <ErrorPages></ErrorPages>

    const { data, isLoading } = api.useGetWorkerQuery(id);
    const [editDavdam] = api.useEditWorkerMutation();

    const clickSave = () => {
        if (btnSubmitRef.current) { btnSubmitRef.current.click() }
    }
    if (isLoading) return (<h2>Загрузка данных</h2>)

    return (
        <>
            <CreateHead title="Карточка сотрудника" redirect={false} nameFunc={"save"} saveFunc={clickSave} namePage="workers" />
            <WorkerForm refBtn={btnSubmitRef} funcRequest={editDavdam} id={id} data={data}></WorkerForm>

        </>
    )
}

export default WorkerEdit