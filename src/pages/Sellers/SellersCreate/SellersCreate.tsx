
import { useRef } from "react"

import SellersForm from "../../../components/SellersForm/SellersForm";

import CreateHead from '../../../components/CreateHead/CreateHead';
import { api } from "../../../store/api/api";
import ErrorPages from "../../Error/ErrorPages";
interface IProps {
    edit: boolean
}



function SellersCreate(props: IProps) {
    const { edit } = props;
    const btnSubmitRef = useRef<HTMLInputElement>(null)
    const clickSave = () => {
        if (btnSubmitRef.current) { btnSubmitRef.current.click() }
    }

    const [addSeller, { isError: addError }] = api.useFetchCreateSellerMutation();
    if (addError) return <ErrorPages></ErrorPages>
    return (
        <>
            <CreateHead redirect={false} title={"Карточка продавца"} nameFunc="save" namePage="sellers" saveFunc={clickSave} />
            <SellersForm funcRequest={addSeller} edit={edit} refBtn={btnSubmitRef}></SellersForm>


        </>
    )
}

export default SellersCreate