import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom'

import { davDamerAPI } from "../../../store/api/DavdamerAPI";
import ErrorPages from '../../Error/ErrorPages';

import CreateHead from '../../../components/CreateHead/CreateHead';
import EditProductForm from '../../../components/EditProductForm/EditProductForm';

interface IProps {
    edit: boolean;
    nameFunc: string;
}
function AddProductChild(props: IProps) {
    const { id, color } = useParams();
    const { edit } = props;
    const { data, error, isLoading } = davDamerAPI.useFetchGetProductQuery(id ? id : "-2");
    const [addProductChild, { isError: editError }] = davDamerAPI.useFetchCreateChildProductMutation();


    const btnSubmitRef = useRef<HTMLInputElement>(null)
    const [sendFormFilters, setSendFormFilters] = useState(false);

    const clickSave = () => {
        if (btnSubmitRef.current) { btnSubmitRef.current.click() }
        setSendFormFilters(true)
    }
    if (isLoading) return (<h2>Загрузка данных</h2>)
    if (error || editError) return (<ErrorPages></ErrorPages>)
    if (!color || !id || !data) return (<ErrorPages></ErrorPages>)


    return (
        <>
            <CreateHead title="Редактировать вариант товара" redirect={false} nameFunc={"save"} saveFunc={clickSave} namePage="products" cancel={true} />
            <EditProductForm sendFormFilters={sendFormFilters} funcRequest={addProductChild} data={data} edit={edit} refBtn={btnSubmitRef} id={id} color={color}></EditProductForm>
        </>
    )
}

export default AddProductChild