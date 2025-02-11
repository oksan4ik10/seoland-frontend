import { useRef } from "react";
import CreateHead from "../../../components/CreateHead/CreateHead";
import DavdamerForm from "../../../components/DavdamerForm/DavdamerForm";

import { davDamerAPI } from "../../../store/api/DavdamerAPI";


function DavdamerCreate() {
    const btnSubmitRef = useRef<HTMLInputElement>(null);

    const clickSave = () => {
        if (btnSubmitRef.current) { btnSubmitRef.current.click() }

    }

    const [createDavdam] = davDamerAPI.useFetchCreateDavdamerMutation();



    return (
        <>
            <CreateHead redirect={false} title={"Карточка давдамера"} nameFunc="save" namePage="davdamers" saveFunc={clickSave} />
            <DavdamerForm refBtn={btnSubmitRef} funcRequest={createDavdam} ></DavdamerForm>


        </>
    )
}
export default DavdamerCreate