import { useRef } from 'react';
import { useParams } from 'react-router-dom'

import { api } from "../../../store/api/api";

import CreateHead from '../../../components/CreateHead/CreateHead';

import DavdamerForm from '../../../components/DavdamerForm/DavdamerForm';
import ErrorPages from '../../Error/ErrorPages';


function DavdamerEdit() {
    const { id } = useParams();
    const btnSubmitRef = useRef<HTMLInputElement>(null)

    if (!id) return <ErrorPages></ErrorPages>

    const { data, isLoading } = api.useFetchGetDavdamerQuery(id);
    const [editDavdam] = api.useFetchEditDavdamerMutation();
    console.log(data);






    const clickSave = () => {
        if (btnSubmitRef.current) { btnSubmitRef.current.click() }
    }
    if (isLoading) return (<h2>Загрузка данных</h2>)

    return (
        <>
            <CreateHead title="Карточка давдамера" redirect={false} nameFunc={"save"} saveFunc={clickSave} namePage="davdamers" />
            <DavdamerForm refBtn={btnSubmitRef} funcRequest={editDavdam} id={id} data={data}></DavdamerForm>

        </>
    )
}

export default DavdamerEdit