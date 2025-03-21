import { useRef } from 'react';
import { useParams } from 'react-router-dom'

import { api } from "../../../store/api/api";

import CreateHead from '../../../components/CreateHead/CreateHead';

import ErrorPages from '../../Error/ErrorPages';

import DirectoryForm from '../../../components/DirectoryForm/DirectoryForm';


function DirectoryEdit() {
    const { id } = useParams();
    const btnSubmitRef = useRef<HTMLInputElement>(null)

    if (!id) return <ErrorPages></ErrorPages>

    const { data, isLoading } = api.useFetchGetAttrValueQuery(id);
    const [editAttr] = api.useFetchEditAttrMutation();

    const clickSave = () => {
        if (btnSubmitRef.current) { btnSubmitRef.current.click() }
    }
    if (isLoading) return (<h2>Загрузка данных</h2>)

    return (
        <>
            <CreateHead title="Карточка аттрибута" redirect={false} nameFunc={"save"} saveFunc={clickSave} namePage="attributes" />
            <DirectoryForm edit={true} refBtn={btnSubmitRef} funcRequest={editAttr} id={id} data={data}></DirectoryForm>

        </>
    )
}

export default DirectoryEdit