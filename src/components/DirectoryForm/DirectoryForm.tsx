/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom";


import style from "./DirectoryForm.module.css"

import urlIconGeneral from "../../assets/images/genetalIcon.svg"

import { IAttributesValues } from "../../models/type";

import Filter from "../Filter/Filter";

import { paramsFilterAttr } from "../../pages/Directory/paramsFilterAttr";

import { useAppDispatch } from "../../store/store";
import { setAttr } from "../../store/reducer/attrReducer";

interface IProps {
    data?: IAttributesValues
    id?: string | null,
    funcRequest?: any,
    refBtn: any,
    edit: boolean;
    sendFormFilters?: boolean;
}



function DirectoryForm(props: IProps) {
    const { data, funcRequest, id, refBtn, edit, sendFormFilters } = props;


    const { register, handleSubmit, formState: { errors } } = useForm<any>({
        defaultValues: {
            label: (data && data.label) ? data.label : "",
            value: (data && data.value) ? data.value : "",

        }
    })


    const filterProduClasses = {
        title: data?.code ? paramsFilterAttr.attr.find((item) => item.id === data.code)?.name : "Выберите тип аттрибута",
        nameFilter: "attr",
        attr: paramsFilterAttr.attr,
        id: true
    }

    const [valueFilter, setValueFilter] = useState("")
    const setParamsFilter = (_: string, value: string) => {
        setValueFilter(value);
    }




    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<any> = async (dataParam) => {
        if (!edit && (!valueFilter)) return;

        const code = data?.code ? data.code : valueFilter;

        const formData = new FormData();

        for (const key in dataParam) {

            formData.append(key, dataParam[key] as any)
        }

        formData.append("code", code);
        dispatch(setAttr(code));
        if (!id) {

            try {
                if (funcRequest) {
                    await funcRequest({ body: formData });
                    navigate(`/attributes`)
                }
            }
            catch {
                navigate(`/404`)

            }
        } else {

            try {
                if (data) {
                    await funcRequest({ id: data.id, body: formData });
                    navigate(`/attributes`)
                }

            } catch {
                navigate(`/404`)

            }

        }
    }

    return (
        <>
            <form className={'form ' + " " + style.form} encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                <div className={style.form__general}>
                    <h3 className="form__title"><img src={urlIconGeneral} alt="desc" />Общее</h3>

                    <div className={"form__label" + " " + (valueFilter ? "value" : "")}>
                        <span>Тип аттрибута</span>
                        {edit && <input defaultValue={filterProduClasses.title} type="text" disabled />}

                        {!edit && <Filter data={filterProduClasses as any} setParamsFilter={setParamsFilter}></Filter>}
                        {!edit && sendFormFilters && !valueFilter && <span className="form__error">Выберите тип</span>
                        }
                    </div>
                    <div className={"form__label"}>
                        <span>Наименование</span>
                        <input placeholder="Заполните наименование" type="text"  {...register("label", { validate: (value) => ((value.length > 0) && (value.length < 21)) })} />
                        {errors.label && <span className="form__error">Длина строки от 1 до 20 символов</span>}
                    </div>
                    <div className={"form__label"}>
                        <span>Значение</span>
                        <input placeholder="Заполните значение" type="text"  {...register("value", { validate: (value) => ((value.length > 0) && (value.length < 21)) })} />
                        {errors.value && <span className="form__error">Длина строки от 1 до 20 символов</span>}
                    </div>




                    <input type="submit" value="Отправить" className="form__submit" ref={refBtn} />
                </div>



            </form>
        </>
    )
}

export default DirectoryForm