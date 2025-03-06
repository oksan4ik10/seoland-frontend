import { useRef, useState } from 'react';

import { api } from "../../../store/api/api";

import CreateHead from '../../../components/CreateHead/CreateHead';


import DirectoryForm from '../../../components/DirectoryForm/DirectoryForm';


function DirectoryCreate() {

    const btnSubmitRef = useRef<HTMLInputElement>(null)


    const [createAttr] = api.useFetchCreateAttrMutation();
    const [sendFormFilters, setSendFormFilters] = useState(false);

    const clickSave = () => {
        if (btnSubmitRef.current) { btnSubmitRef.current.click() }
        setSendFormFilters(true)
    }




    return (
        <>
            <CreateHead title="Карточка аттрибута" redirect={false} nameFunc={"save"} saveFunc={clickSave} namePage="attributes" />
            <DirectoryForm sendFormFilters={sendFormFilters} edit={false} refBtn={btnSubmitRef} funcRequest={createAttr}></DirectoryForm>

        </>
    )
}

export default DirectoryCreate