import { useRef } from 'react';
import { useParams } from 'react-router-dom'

import { api } from "../../../store/api/api";
import ErrorPages from '../../Error/ErrorPages';

import CreateHead from '../../../components/CreateHead/CreateHead';
import OrderForm from '../../../components/OrderForm/OrderForm';

interface IProps {
    edit: boolean;
    nameFunc: string;
}
function ProductsShowEdit(props: IProps) {
    const { id } = useParams();

    const { edit, nameFunc } = props;
    const { data, error, isLoading } = api.useFetchGetOrderQuery(id ? id : "-2");


    const [editOrder, { isError: editError }] = api.useFetchEditOrderMutation();

    const btnSubmitRef = useRef<HTMLInputElement>(null)
    const clickSave = () => {
        if (btnSubmitRef.current) { btnSubmitRef.current.click() }
    }
    if (isLoading) return (<h2>Загрузка данных</h2>)
    if (error || editError || !data) return (<ErrorPages></ErrorPages>)

    return (
        <>
            <CreateHead title="Карточка заказа" redirect={false} nameFunc={nameFunc} saveFunc={clickSave} namePage="orders" />
            <OrderForm funcRequest={editOrder} data={data} edit={edit} refBtn={btnSubmitRef} id={id} ></OrderForm>
        </>
    )
}

export default ProductsShowEdit