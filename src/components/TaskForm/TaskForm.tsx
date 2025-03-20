/* eslint-disable @typescript-eslint/no-explicit-any */
import {  useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import {  useNavigate } from "react-router-dom";

import style from "./TaskForm.module.css"

import moment from "moment";
import urlIconGeneral from "../../assets/images/genetalIcon.svg"
import urlIconDesc from "../../assets/images/descIcon.svg"
import {  ITask } from "../../models/type";

import { api } from "../../store/api/api";
import Filter from "../Filter/Filter";

import ErrorPages from "../../pages/Error/ErrorPages";




interface IProps {
    edit: boolean,
    data?: ITask,
    id?: string | null,
    refBtn: any,
    funcRequest?: any,
    sendFormFilters: boolean
}



function TaskForm(props: IProps) {
    const { edit, data, refBtn, funcRequest, sendFormFilters, id } = props;

    const { register, handleSubmit, formState: { errors } } = useForm<any>({
        defaultValues: {
            name: (data && data.name) ? data.name : edit ? "" : "Не заполнено",
            date_start: (data && data.date_start) ? data.date_start : "",
            date_PlanEnd: (data && data.date_PlanEnd) ? data.date_PlanEnd : "",
            timePlan: (data && data.timePlan) ? data.timePlan : edit ? "" : "Не заполнено",
            desc: (data && data.desc) ? data.desc : edit ? "" : "Не заполнено",
        }
    })







    const filterDataStart = {
        title: data?.date_start ? moment(data.date_start).format("DD.MM.YYYY") : "Выберите дату",
        nameFilter: "date_start",
        date_start:"",
       type: "date"
    }
    const filterDataEnd = {
        title: data?.date_PlanEnd ?  moment(data.date_PlanEnd).format("DD.MM.YYYY") : "Выберите дату",
        nameFilter: "date_PlanEnd",
        date_PlanEnd:"",
       type: "date"
    }

    const { data: workers, error: errorWorkers, isLoading: isWorkers } = api.useGetWorkersQuery({ idRole: "67ab2abe01aad79d986f8c37" });
    const filterWorkers = {
        title: data?.workerName || "Выберите ответственного",
        nameFilter: "IDworker",
        IDworker: workers ? workers.map((item) => ({ name: item.name, id: item._id })) : [],
        id: true
    }
    const { data: projects, error: errorProjects, isLoading: isProjects } = api.useGetProjectsQuery({});
    const filterProjects = {
        title: data?.projectName || "Выберите проект",
        nameFilter: "IDproject",
        IDproject: projects ? projects.map((item) => ({ name: item.name, id: item._id })) : [],
        id: true
    }



    const [valuesFilter, setValuesFilter] = useState<any>({
        IDproject: data?.IDproject || "",
        IDworker: data?.IDworker || "",
        date_start:data?.date_start || "",
        date_PlanEnd:data?.date_PlanEnd || ""


    })


    const setParamsFilter = (key: string, value: string) => {
        const obj: any = Object.assign({}, valuesFilter)

        obj[key] = value ? value : (data as any)[key as any] || undefined ;

        setValuesFilter(obj)
    }



    const [desc, setDesc] = useState((data && data.desc) ? data.desc.replace(/<\/?[a-zA-Z]+>/gi, '') : "");
    const changeDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDesc(e.target.value);
    }



    const navigate = useNavigate();

    const onSubmit: SubmitHandler<any> = async (dataParam) => {

        let filterValues = true;
        for (const key in valuesFilter) {
            if (!valuesFilter[key as any]) {
                filterValues = false;
                break
            }
        }



        if (!filterValues) return

        if (desc) dataParam.desc = desc;
        dataParam = Object.assign(dataParam, valuesFilter)

        if (!id) {

            try {
                if (funcRequest) {
                    const data = await funcRequest({ id: valuesFilter.seller, body: dataParam });
                    if (data.error) return
                    navigate(`/tasks`)
                }
            }
            catch {
                navigate(`/404`)

            }
        } else {
  
            try {
                if (funcRequest && data) {
               

                    const dataRequest = await funcRequest({ id, body: dataParam });
                    if (dataRequest.error) return
                    navigate(`/tasks`)
                }
            } catch {
                navigate(`/404`)

            }

        }
    }






    if ( errorWorkers || errorProjects) return <ErrorPages></ErrorPages>

    if (isWorkers || isProjects) return <h2>Загрузка данных</h2>

    return (
        <>
            <form className={'form ' + (edit && !data  ? style.formEdit : "") + " " + style.form + " " + (!edit ? "show" : "")} encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                <div className={"form__head " + style.form__head}>

                    <label className="form__name form__label">
                        {edit && <span>Название</span>}
                        <input placeholder="Заполните название" type="text"  {...register("name", { validate: (value) => ((value.length > 2) && (value.length < 30)), disabled: edit ? false : true })} />
                        {errors.title && <span className="form__error">Длина строки от 2 до 30 символов</span>}
                    </label>
                </div>
                <div className={style.form__general}>
                    <h3 className="form__title"><img src={urlIconGeneral} alt="desc" />Общее</h3>
                    <div className={"form__label" + " " + (valuesFilter.IDproject ? "value" : "")}>
                        <span>Проект</span>
                        {!edit && data?.projectName && <span className={style.spanName}>{data.projectName}</span>}
                        {edit && <Filter data={filterProjects as any} setParamsFilter={setParamsFilter}></Filter>}

                        {edit && sendFormFilters && !valuesFilter.IDproject && <span className="form__error">Выберите проект</span>}
                    </div>

                    <div className={"form__label" + " " + (valuesFilter.date_start ? "value" : "")}>
                        <span>Начало</span>
                        {((!edit && data) ) && <span className={style.spanName}>
                             {moment(data.date_start).format("DD.MM.YYYY")}
                            </span>}
                        {edit && <Filter data={filterDataStart as any} setParamsFilter={setParamsFilter}></Filter>}

                        {sendFormFilters && edit && !valuesFilter.date_start && <span className="form__error">Выберите дату</span>}
                    </div>

                    <div className={"form__label" + " " + (valuesFilter.date_PlanEnd ? "value" : "")}>
                        <span>Окончание</span>
                        {((!edit && data)) && <span className={style.spanName}>
                             {moment(data.date_PlanEnd).format("DD.MM.YYYY")}
                            </span>}
                        {edit && <Filter data={filterDataEnd as any} setParamsFilter={setParamsFilter}></Filter>}

                        {sendFormFilters && edit && !valuesFilter.date_PlanEnd && <span className="form__error">Выберите дату</span>}
                    </div>
                    <div className={"form__label " + style.form__price}>
                        <span>Трудозатраты (часы)</span>
                        {!edit && data && <span className={style.spanName + " "}>{data.timePlan}</span>}
                        {edit && <input placeholder="Введите предполагаемые трудозатраты" type="number"  {...register("timePlan", {
                            validate: (value) => ((value > 0)), disabled: edit ? false : true
                        }
                        )} />}
                        {errors.timePlan && <span className="form__error">Введите положительное число </span>}
                    </div>
                    <div className={"form__label" + " " + (valuesFilter.IDworker ? "value" : "")}>
                        <span>Ответственный за задачу</span>
                        {!edit && data?.workerName && <span className={style.spanName}>{data.workerName}</span>}
                        {edit && <Filter data={filterWorkers as any} setParamsFilter={setParamsFilter}></Filter>}

                        {edit && sendFormFilters && !valuesFilter.IDworker && <span className="form__error">Выберите ответственного</span>}
                    </div>


{/* 
                    <div className={"form__label " + style.form__price}>
                        <span>Стоимость</span>
                        {!edit && data && <span className={style.spanName + " "}>{dataArea.price}</span>}
                        {edit && <input placeholder="0.00 ₽" type="number"  {...register("price", {
                            validate: (value) => ((value > 9) && ((value <= 500000))), disabled: edit ? false : true
                        }
                        )} />}
                        {errors.price && <span className="form__error">Введите  от 10 ₽ до 500 000 ₽ </span>}
                    </div> */}

                </div>



                <div className={"form__desc " + style.form__desc + " " + ((data) ? style.desc__full : "")}>
                    <h3 className="form__title"> <img src={urlIconDesc} alt="desc" />Описание</h3>
                    <div className="form__textarea">
                        <label className="form__label">
                            <span>Общее описание товара</span>
                            {edit && <textarea name="description" onChange={changeDesc} id="" cols={30} rows={10} value={desc}></textarea>}
                            {!edit && <textarea disabled name="description" value={desc ? desc : "Не заполнено"} onChange={changeDesc} id="" cols={30} rows={10}></textarea>}
                        </label>
                    </div>

                </div>

                <input type="submit" value="Отправить" className="form__submit" ref={refBtn} />
            </form>
        </>
    )
}

export default TaskForm