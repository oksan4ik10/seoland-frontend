/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm, SubmitHandler, useFieldArray } from "react-hook-form"
import {  useNavigate } from "react-router-dom";

import style from "./TaskPlanForm.module.css"

import moment from "moment";
import urlIconGeneral from "../../assets/images/genetalIcon.svg"
import urlIconDesc from "../../assets/images/descIcon.svg"
import {   ITrack } from "../../models/type";






interface IProps {
    data: ITrack,
    id: string,
    refBtn: any,
    funcRequest?: any,
}



function TaskPlanForm(props: IProps) {
    const {  data, refBtn, funcRequest, id } = props;

    const { register,control, handleSubmit } = useForm<any>({
        defaultValues: {
            attr: data.attr
        }
    })
    const { fields } = useFieldArray({
        control,
        name: "attr", 
      });

    const navigate = useNavigate();

    const onSubmit: SubmitHandler<any> = async (dataParam) => {
    dataParam.attr = dataParam.attr.map((item: any)=>{
        item.timePlan = +item.timePlan;
        item.timeFact = +item.timeFact;
        return item
    })

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


    return (
        <>
            <form className={'form ' +  style.formEdit + " " + style.form} encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                <div className={style.form__general}>
                    <h3 className="form__title"><img src={urlIconGeneral} alt="desc" />Описаниие задачи</h3>
                    <div className={"form__label"}>
                        <span>Проект</span>
                        <span className={style.spanName}>{data.projectName}</span>
                    </div>
                    <div className={"form__label"}>
                        <span>Задача</span>
                        <span className={style.spanName}>{data.taskName}</span>
                    </div>
                    <div className={"form__label"}>
                        <span>Ответственный за задачу</span>
                        <span className={style.spanName}>{data.workerName}</span>
                    </div>
                    <div className={"form__label"}>
                        <span>Информация</span>
                        <span className={style.spanName}>{data.taskDesc}</span>
                    </div>


                </div>
                <div className={"form__desc " + style.form__desc + " " + ((data) ? style.desc__full : "")}>
                    <h3 className="form__title"> <img src={urlIconDesc} alt="desc" />Планирование</h3>
                    <div className={style.planItem}>
                        <span>Дата</span><span>Время по плану</span><span>Время по факту</span>
                    </div>
                    {fields.map((item, index) => (
                        <div key={item.id} className={style.planItem}>
                        <span> {moment(data.attr[index].dateWork).format("DD.MM.YYYY")}</span>
                        <input
                            {...register(`attr.${index}.timePlan`)}
                            type="number"
                        />
                                         <input
                            {...register(`attr.${index}.timeFact`)}
                            type="number"
                        />
                        </div>
                    ))}

                </div>

                <input type="submit" value="Отправить" className="form__submit" ref={refBtn} />
            </form>
        </>
    )
}

export default TaskPlanForm