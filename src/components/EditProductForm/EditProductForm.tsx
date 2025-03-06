/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom";

import style from "./EditProductForm.module.css"

import urlIconGeneral from "../../assets/images/genetalIcon.svg"
import urlIconPhoto from "../../assets/images/photoIcon.svg"


import { IProduct } from "../../models/type";

import { api } from "../../store/api/api";


import ErrorPages from "../../pages/Error/ErrorPages";

import SelectMultiple from "../SelectMultiple/SelectMultiple";


interface IProps {
    edit: boolean,
    data: IProduct
    id: string,
    refBtn: any,
    funcRequest?: any,
    sendFormFilters: boolean
    color: string;
}


interface IAttrSize {
    name: string;
    id: string;
    check: boolean;
}

function EditProductForm(props: IProps) {
    const { edit, data, funcRequest, sendFormFilters, id, color, refBtn } = props;

    const { register, getValues, formState: { errors }, handleSubmit } = useForm<any>({
        defaultValues: {
            title: (data && data.title) ? data.title : edit ? "" : "Не заполнено",
            num_in_stock: 0,

        }
    })


    const { data: attrValues, error: errorAttrValues, isLoading: isAttrValues } = api.useGetEnumsAttrQuery()
    const dataArea: any = {
        categories: data ? data.sub_categories[0].full_name.toLocaleString() : "",
        categoryChildren: data?.sub_categories[0].child ? data.sub_categories[0].child.name : "",
        seller: (data && data.seller.name) ? data.seller.name : edit ? "" : "Продавец не выбран",
        price: (data?.price.incl_tax) ? data.price.incl_tax + " ₽" : "0,00 ₽",

        color: "",
        size: "",
        material: (data?.material && attrValues) ? attrValues["material"].find((item) => item.value === data.material)?.label : edit ? "" : "Не заполнено"
    }


    const childProduct = data.items.find((item) => item.color.value === color);
    const arrSizes = childProduct?.sizes ? childProduct.sizes.map((item) => item.value) : []



    const filterSize = {
        title: dataArea.size ? dataArea.size : "Выберите размер",
        nameFilter: "attrSize",
        attrSize: attrValues ? attrValues["size"].reduce((res: IAttrSize[], item) => {
            if (arrSizes.indexOf(item.value) !== -1) return res
            res.push({ name: item.label, id: item.value, check: false })
            return res
        }, []) : [],

    }




    const [attrSize, setAttrSize] = useState<string[]>([])
    const saveSize = (data: IAttrSize[]) => {
        const arr = data.filter((item) => item.check).map((item) => item.id)
        setAttrSize(arr);

    }



    const navigate = useNavigate();

    const onSubmit: SubmitHandler<any> = async (dataParam) => {
        if (!data) return


        if (((attrSize.length !== 0) && !dataParam["num_in_stock"]) || ((attrSize.length === 0) && dataParam["num_in_stock"])) return


        const formData = new FormData();


        formData.append("color", color);
        if (attrSize.length > 0) formData.append("sizes", JSON.stringify(attrSize));

        const arrNewCount: any = [];
        for (const key in dataParam) {
            if (key[0] === "A") {
                arrNewCount.push({
                    product_id: key.slice(1),
                    num_in_stock: +dataParam[key]
                })
                continue
            }


            if (+dataParam[key]) formData.append(key, dataParam[key] as any)
        }
        formData.append("new_count_sizes", JSON.stringify(arrNewCount))
        // for (const key of formData.keys()) {
        //     console.log(key, formData.get(key));
        // }
        // return
        try {
            if (funcRequest && data) {

                const dataRequest = await funcRequest({ id: id, body: formData });
                if (dataRequest.error) return
                navigate(`/products/${id}`)
            }
        } catch {
            navigate(`/404`)

        }


    }

    if (errorAttrValues || !childProduct) return <ErrorPages></ErrorPages>

    if (isAttrValues) return <h2>Загрузка данных</h2>

    return (
        <>
            <form className={'form ' + (edit ? "" : "show") + " " + style.form} encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                <div className={"form__head " + style.form__head}>
                    <label className="form__name form__label">
                        <input type="text" value={(data && data.title) ? data.title : "Не заполнено"} disabled />

                    </label>
                </div>
                <div className={style.form__attr}>
                    <h3 className="form__title"><img src={urlIconGeneral} alt="desc" />Характеристики</h3>



                    <div className={"form__label" + " "}>
                        <span>Цвет</span>
                        <span className={style.color}>{childProduct ? childProduct.color.label : ""}</span>
                    </div>
                    <div className={"form__label"}>
                        <span>Размеры</span>

                        <div className={style.sizes}>
                            {childProduct.sizes.map((item) => {
                                return <div className={style.size} key={item.product_id}>
                                    <div className={style.sizeInfo}>
                                        <span className={style.spanSize} >{item.label}</span>
                                        <input type="number" {...register(`A${item.product_id}`, { validate: (value) => value >= 0 })} defaultValue={item.num_in_stock} className={style.spanSize} />
                                        <span>шт.</span>
                                    </div>

                                    {errors[item.product_id] && <span className={"form__error " + style.errorSpan}>Число положительное или 0</span>}
                                </div>
                            })}
                        </div>
                    </div>
                    <div className={"form__label" + " " + (attrSize.length > 0 ? "value" : "") + " " + style.multiple}>
                        <span>Добавить размер</span>
                        <SelectMultiple data={filterSize} setParamsFilter={saveSize}></SelectMultiple>

                        {edit && sendFormFilters && attrSize.length === 0 && getValues("num_in_stock") > 0 && <span className="form__error">Выберите размер</span>}
                    </div>
                    <label className="form__label">
                        <span>В наличии, шт.</span>
                        <input placeholder="Заполните количество товара" type="number"  {...register("num_in_stock")} />
                        {errors.num_in_stock && <span>ssdjksjd</span>}
                        {edit && sendFormFilters && attrSize.length !== 0 && <span className="form__error">Число должно быть больше 0</span>}
                    </label>
                </div>

                <div className={style.form__files}>
                    <h3 className="form__title"> <img src={urlIconPhoto} alt="photoIcon" />Фото варианта товара</h3>
                    <div className={style.form__addFile}>
                        <div className={"form__file " + style.form__fileImg}>
                            {childProduct.images.map((item, index) => {
                                return <div key={index} className={"form__addFile " + style.file}>
                                    <div className={style.wrapImg}>
                                        <img src={item.original} alt="img" />
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>

                <input type="submit" value="Отправить" className="form__submit" ref={refBtn} />



            </form>
        </>
    )
}

export default EditProductForm