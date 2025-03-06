import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom'

import { api } from "../../../store/api/api";
import ErrorPages from '../../Error/ErrorPages';

import CreateHead from '../../../components/CreateHead/CreateHead';
import AddProductForm from '../../../components/AddProductForm/AddProductForm';

interface IProps {
    edit: boolean;
    nameFunc: string;
}
function AddProductChild(props: IProps) {
    const { id } = useParams();
    const { edit } = props;
    const { data, error, isLoading } = api.useFetchGetProductQuery(id ? id : "-2");
    const [addProductChild, { isError: editError }] = api.useFetchCreateChildProductMutation();


    const btnSubmitRef = useRef<HTMLInputElement>(null)
    const [sendFormFilters, setSendFormFilters] = useState(false);

    const clickSave = () => {
        if (btnSubmitRef.current) { btnSubmitRef.current.click() }
        setSendFormFilters(true)
    }
    if (isLoading) return (<h2>Загрузка данных</h2>)
    if (error || editError) return (<ErrorPages></ErrorPages>)


    return (
        <>
            <CreateHead title="Добавить вариант товара" redirect={false} nameFunc={"save"} saveFunc={clickSave} namePage="products" cancel={true} />
            <AddProductForm sendFormFilters={sendFormFilters} funcRequest={addProductChild} data={data} edit={edit} refBtn={btnSubmitRef} id={id} ></AddProductForm>
        </>
    )
}

export default AddProductChild