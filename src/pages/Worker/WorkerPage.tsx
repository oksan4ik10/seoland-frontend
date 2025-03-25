

import { api } from "../../store/api/api";
import Pages from "../../components/PagesHead/PagesHead";
import { useAppSelector } from "../../store/store";
import TaskWorkerForm from "../../components/TaskWorkerForm/TaskWorkerForm";
import style from "./WorkerPage.module.css"





function WorkerPage() {
    const idWorker = useAppSelector((store) => store.userReducer).user.id;
    const { data, error, isLoading } = api.useGetWorkerTaskQuery(idWorker);
     const [editTime, { isError: editError }] = api.useUpdateTimeFactWorkerMutation();
    if (isLoading) return (<p>Загрузка данных</p>)
    if(editError) return (<p>Ошибка</p>)

    return (
        <>
        <div className={style.container}>
        <Pages isWorker={true} title={"Карточка задачи"} />
            {error && <p>Задачи не найдены</p>}
            {data  &&  <TaskWorkerForm data={data} id={data._id} funcRequest={editTime}></TaskWorkerForm>}

        </div>
        
        </>
    )
}

export default WorkerPage