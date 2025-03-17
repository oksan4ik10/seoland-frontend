import { useRef } from "react";
import CreateHead from "../../../components/CreateHead/CreateHead";
import WorkerForm from "../../../components/WorkerForm/WorkerForm";

import { api } from "../../../store/api/api";


function WorkerCreate() {
    const btnSubmitRef = useRef<HTMLInputElement>(null);

    const clickSave = () => {
        if (btnSubmitRef.current) { btnSubmitRef.current.click() }

    }

    const [createWorker] = api.useCreateWorkerMutation();



    return (
        <>
            <CreateHead redirect={false} title={"Карточка сотрудника"} nameFunc="save" namePage="workers" saveFunc={clickSave} />
            <WorkerForm refBtn={btnSubmitRef} funcRequest={createWorker} ></WorkerForm>


        </>
    )
}
export default WorkerCreate