/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm, SubmitHandler } from "react-hook-form"
import {  useNavigate } from "react-router-dom";

import style from "./TaskWorkerForm.module.css"

import moment from "moment";
import urlIconGeneral from "../../assets/images/genetalIcon.svg"
import urlIconDesc from "../../assets/images/descIcon.svg"
import {   ITask } from "../../models/type";
import { useState } from "react";






interface IProps {
    data: ITask,
    id: string,
    funcRequest?: any,
}



function TaskWorkerForm(props: IProps) {
    const {  data, funcRequest, id } = props;

    const { register, handleSubmit } = useForm<any>({
        defaultValues: {
            timeFact: 0
        }
    })


    const navigate = useNavigate();

    const [isSuccess, setIsSuccess] = useState(false)
    const onSubmit: SubmitHandler<any> = async (dataParam) => {
        dataParam.dateWork = new Date();
            try {
                if (funcRequest && data) {
                    const dataRequest = await funcRequest({ id, body: dataParam });
                    if (dataRequest.error) return
                    setIsSuccess(true)
                    setTimeout(()=> {
                        setIsSuccess(false)
                    }, 1500)
                }
            } catch {
                navigate(`/404`)

            }
    }


    return (
        <>
        {isSuccess && <div className={style.success}>Данные о затраченном времени внесены </div>}
            <form className={'form ' +  style.formEdit + " " + style.form} encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                <div className={style.form__general}>
                    <h3 className="form__title"><img src={urlIconGeneral} alt="desc" />Описаниие задачи</h3>
                    <div className={"form__label"}>
                        <span>Проект</span>
                        <span className={style.spanName}>{data.projectName}</span>
                    </div>
                    <div className={"form__label"}>
                        <span>Задача</span>
                        <span className={style.spanName}>{data.name}</span>
                    </div>
                    <div className={"form__label"}>
                        <span>Информация о проекте</span>
                        <span className={style.spanName}>{data.projectDesc}</span>
                    </div>
                    <div className={"form__label"}>
                        <span>Информация о задаче</span>
                        <span className={style.spanName}>{data.desc}</span>
                    </div>


                </div>
                <div className={"form__desc " + style.form__desc + " " + ((data) ? style.desc__full : "")}>
                    <h3 className="form__title"> <img src={urlIconDesc} alt="desc" />Планирование</h3>
                    <div className={style.planItem}>
                        <span>Дата</span><span>Время по факту</span>
                    </div>
                    <div  className={style.planItem}>
                    <span> {moment(new Date()).format("DD.MM.YYYY")}</span>
                    <input
                            {...register(`timeFact`)}
                            type="number"
                        /></div>
                        <input type="submit" value="Отправить" className={style.form__submit}  />
                </div>

               
            </form>
        </>
    )
}

export default TaskWorkerForm