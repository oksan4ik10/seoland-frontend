import { useRef } from 'react';
import { useParams } from 'react-router-dom'

import { davDamerAPI } from "../../../store/api/DavdamerAPI";
import ErrorPages from '../../Error/ErrorPages';

import CreateHead from '../../../components/CreateHead/CreateHead';
import SellersForm from '../../../components/SellersForm/SellersForm';

interface IProps {
    edit: boolean;
    nameFunc: string;
}
function SellersShowEdit(props: IProps) {
    const { id } = useParams();
    const { edit, nameFunc } = props;
    const { data, error, isLoading } = davDamerAPI.useFetchGetSellerQuery(id ? id : "-2");
    const [editSeller, { isError: editError }] = davDamerAPI.useFetchEditSellerMutation();

    const btnSubmitRef = useRef<HTMLInputElement>(null)
    const clickSave = () => {
        if (btnSubmitRef.current) { btnSubmitRef.current.click() }
    }
    if (isLoading) return (<h2>Загрузка данных</h2>)
    if (error || editError) return (<ErrorPages></ErrorPages>)


    return (
        <>
            <CreateHead title="Карточка продавца" redirect={false} nameFunc={nameFunc} saveFunc={clickSave} namePage="sellers" />
            <SellersForm funcRequest={editSeller} data={data} edit={edit} refBtn={btnSubmitRef} id={id} ></SellersForm>
        </>
    )
}

export default SellersShowEdit