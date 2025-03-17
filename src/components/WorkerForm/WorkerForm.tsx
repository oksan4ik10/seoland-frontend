/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom";

import style from "./WorkerForm.module.css"

import urlIconGeneral from "../../assets/images/genetalIcon.svg"


import { IWorker } from "../../models/type";
import { useState } from "react";
import { api } from "../../store/api/api";
import Filter from "../Filter/Filter";



interface IProps {
    data?: IWorker
    id?: string | null,
    funcRequest?: any,
    refBtn: any,
}



function WorkerForm(props: IProps) {
    const { data, funcRequest, id, refBtn } = props;



    const { register, handleSubmit, formState: { errors } } = useForm<any>({
        defaultValues: {
            name: (data && data.name) ? data.name : "",
            login: (data && data.login) ? data.login : "",
            password:  "",
            salary: (data && data.salary) ? data.salary : undefined,
        }
    })

    const [errorsPassword, setErrorsPassword] = useState<string[]>([]);
    const { data: roles,isLoading: isLoadingRoles } = api.useGetRolesQuery();

    
    const filterRoles = {
        title: data?.roleName || "Выберите роль",
        nameFilter: "roles",
        roles: roles ? roles.map((item) => ({ name: item.name, id: item._id })) : [],
        id: true
    }

    const [valueFilter, setValueFilter] = useState(data?.idRole || '');
    const setParamsFilter = (_: string, value: string) => {
        if (!value) return
        setValueFilter(value)


    }
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<any> = async (dataParam) => {
 
        dataParam['idRole'] = valueFilter

        if (!id) {

            try {
                if (funcRequest) {
                    const data = await funcRequest({ body: dataParam });

                    if (data.error) {
                        if (data.error.data.password) setErrorsPassword(data.error.data.password)
                        else navigate(`/404`)
                        return
                    }
                    navigate(`/workers`)
                }
            }
            catch {
                navigate(`/404`)

            }
        } else {

            try {
                if (data) {
                    const dataRequest = await funcRequest({ id: data._id, body: dataParam });
                    if (dataRequest.error) {
                        if (dataRequest.error.data.password) setErrorsPassword(dataRequest.error.data.password)
                        else navigate(`/404`)
                    }
                    navigate(`/workers`)
                }

            } catch {
                navigate(`/404`)

            }

        }
    }

    return (
        <>
            {!isLoadingRoles &&<form className={'form ' + " " + style.form} encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                <div className="form__head">
                    <div className="form__name">
                        <div className={"form__label"}>
                            <span>Ф.И.О</span>
                            <input placeholder="Заполните фамилию, имя и отчество" type="text"  {...register("name", { validate: (value) => ((value.length > 2) && (value.length < 21)) })} />
                            {errors.name && <span className="form__error">Длина строки от 3 до 20 символов</span>}
                        </div>
                    </div>
                </div>
                <div className={style.form__general}>
                    <h3 className="form__title"><img src={urlIconGeneral} alt="desc" />Информация о сотруднике</h3>

                    {roles && <div className={"form__label"}>
                        <span>Роль в системе</span>
                        <Filter data={filterRoles as any} setParamsFilter={setParamsFilter}></Filter>
                    </div>}

                    <div className={"form__label"}>
                        <span>Логин</span>
                        <input placeholder="Заполните логин" type="text"  {...register("login", { validate: (value) => ((value.length > 3))})} />
                        {errors.login && <span className="form__error">Длина строки от 4 символов</span>}
                    </div>
                    
                    <div className={"form__label"}>
                        <span>Пароль</span>
                        <input placeholder="Заполните пароль" type="text"  {...register("password", { validate: (value) => ((value.length > 7) && (value.length < 21)) })} />
                        {errors.password && <span className="form__error">Длина пароля от 8 до 20 символов</span>}
                        {(errorsPassword.length > 0) && errorsPassword.map((item) => <span className="form__error">{item}</span>)}
                    </div>

                    <div className={"form__label"}>
                        <span>Оплата в час</span>
                        <input placeholder="Заполните в рублях" type="number"  {...register("salary", { validate: (value) => ((value > 0) && value !== undefined)})} />
                        {errors.login && <span className="form__error">Заполните поле</span>}
                    </div>
                    <input type="submit" value="Отправить" className="form__submit" ref={refBtn} />
                </div>



            </form>}
        </>
    )
}

export default WorkerForm