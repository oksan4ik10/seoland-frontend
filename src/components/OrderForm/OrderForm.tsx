/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { useEffect, useRef, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom";

import style from "./OrderForm.module.css"

import urlIconClient from "../../assets/images/clientIcon.svg"
import urlIconDelivery from "../../assets/images/deliveryIcon.svg"
import urlIconComment from "../../assets/images/commentIcon.svg"
import urlIconCart from "../../assets/images/cartIcon.svg"
import urlIconPay from "../../assets/images/payIcon.svg"
import { IOrderInfo } from "../../models/type";

import TitleProduct from "../TitleProduct/TitleProduct";
import Filter from "../Filter/Filter";

import { statusOrder } from "../../models/type";

interface IProps {
    edit: boolean,
    data: IOrderInfo
    id?: string | null,
    refBtn: any,
    funcRequest?: any
}



function OrderForm(props: IProps) {
    const { edit, data, id, refBtn, funcRequest } = props;

    const { register, handleSubmit, formState: { errors } } = useForm<any>({
        defaultValues: {
            line1: data.shipping_address.line1 ? data.shipping_address.line1 : "Не заполнено",

        }
    })
    console.log(data);





    const navigate = useNavigate();
    const onSubmit: SubmitHandler<any> = async (dataParam) => {
        const formData = new FormData();
        const obj: any = {};
        for (const key in dataParam) {
            if (dataParam[key]) obj[key]
                = dataParam[key]
        }
        obj["notes"] = desc;
        obj["date"] = filterDate;
        formData.append("shipping_address", JSON.stringify(obj));
        formData.append("status", valueFilter);


        try {
            if (funcRequest) {
                const data = await funcRequest({ id: id, body: formData })
                if (data) navigate(`/orders`)
            }
        } catch (err) {
            navigate(`/404`)

        }

    }
    const [desc, setDesc] = useState(data.shipping_address.notes ? data.shipping_address.notes : edit ? "" : "(пусто)");
    const changeDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDesc(e.target.value);
    }

    function declOfNum(number: number) {
        const titles = ["товар", "товара", "товаров"]
        const cases = [2, 0, 1, 1, 1, 2];
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }


    const refHead = useRef<HTMLDivElement>(null);
    const refClient = useRef<HTMLDivElement>(null);
    const refDelivery = useRef<HTMLDivElement>(null);
    const refOrder = useRef<HTMLDivElement>(null);
    const [isScroll, setIsScroll] = useState(false);
    useEffect(() => {
        let height = 0;
        if (refHead.current) {
            height += refHead.current.clientHeight
        }
        if (refClient.current) height += refClient.current.clientHeight
        if (refDelivery.current) height += refDelivery.current.clientHeight
        if (refOrder.current && (refOrder.current.clientHeight > height)) {

            refOrder.current.style.height = height + "px"; setIsScroll(true)
        }


    }, [])


    const [valueFilter, setValueFilter] = useState(data.status);
    const setParamsFilter = (_: string, value: string) => {
        if (!value) return
        setValueFilter(value)


    }
    const [statusFilter, setStatusFilter] = useState<any[]>([]);
    const filterStatus = {
        title: data.statusName ? data.statusName : "",
        nameFilter: "status",
        status: statusFilter,
        id: true
    }
    useEffect(() => {
        const arr = [];
        for (const key in statusOrder) {
            const newObj = {
                name: statusOrder[key],
                id: key
            }
            arr.push(newObj);

        }
        setStatusFilter(arr)
    }, [])

    const stateDateFilter = {
        title: data.shipping_address.date ? moment(data.shipping_address.date).format("DD.MM.YYYY") : edit ? "Выберите дату" : "Не заполнено",
        nameFilter: "date",
        type: "date",
        date: [],
        dateValue: data.shipping_address.date ? data.shipping_address.date : "",
        minNowDate: true

    }

    const [filterDate, setFilterDate] = useState<Date>();
    const setParamsFilterDate = (_: string, value: string) => {
        setFilterDate(value as any)
    }
    return (
        <>
            <form className={'form ' + (edit ? "" : "show") + " " + style.form} encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                <div className={"form__head" + " " + style.form__head} ref={refHead}>
                    <div className={"form__name " + style.form__name}>
                        <div className={style.form__orderTitle}>
                            <p>Номер заказа: </p>
                            <p>{data.number}</p>

                        </div>
                        {data && data.date_placed && <span>Дата заказа: {moment(data.date_placed).format("DD.MM.YYYY")}</span>}
                        {data && data.updated_dt && <span>Дата изменения: {moment(data.updated_dt).format("DD.MM.YYYY")}</span>}
                    </div>
                    {!edit && <div className={style.status}>
                        {data.statusName}
                    </div>}
                    {edit && <Filter data={filterStatus as any} setParamsFilter={setParamsFilter}></Filter>}
                </div>
                <div className={style.form__client} ref={refClient}>
                    <h3 className="form__title"><img src={urlIconClient} alt="desc" />О клиенте</h3>

                    <label className="form__label">
                        <span>ID клиента</span>
                        <input defaultValue={data.user.id} type="text" disabled />
                    </label>

                    <label className="form__label">
                        <span>ФИО</span>
                        <input defaultValue={data.shipping_address.last_name + " " + data.shipping_address.first_name} type="text" disabled />
                    </label>
                    <label className="form__label">
                        <span>Телефон</span>
                        <input defaultValue={data.shipping_address.phone_number} type="text" disabled />
                    </label>


                </div>
                <div className={style.form__delivery} ref={refDelivery}>
                    <h3 className="form__title"><img src={urlIconDelivery} alt="desc" />Доставка</h3>

                    <label className="form__label">
                        <span>Адрес</span>
                        <input placeholder="Заполните адрес клиента" type="text"  {...register("line1", { validate: (value) => ((value.length > 10) && (value.length < 150)), disabled: edit ? false : true })} />

                        {errors.line1 && <span className="form__error">Длина строки от 10 до 150 символов</span>}
                    </label>
                    <label className="form__label">
                        <span>Способ доставки</span>
                        <input defaultValue={data.shipping_address.custom_shipping_method ? data.shipping_address.custom_shipping_method : data.shipping_address.shipping_method} type="text" disabled />
                    </label>
                    <div className={"form__label" + " " + (stateDateFilter.title ? "value" : "")}>
                        <span>Дата доставки</span>
                        {!edit && <input defaultValue={stateDateFilter.title} type="text" disabled />}
                        {edit && <Filter data={stateDateFilter as any} setParamsFilter={setParamsFilterDate}></Filter>}
                    </div>
                    <label className="form__label" key={Math.random()}>
                        <span>Время доставки</span>
                        <input defaultValue={data.shipping_address.time ? data.shipping_address.time : edit ? "" : "Не заполнено"} placeholder="Заполните время доставки" type="text"  {...register("time", { disabled: edit ? false : true })} />
                    </label>


                </div>
                <div className={"form__desc" + " " + style.form__comment}>
                    <h3 className="form__title"> <img src={urlIconComment} alt="desc" />Комментарии</h3>
                    <div className="form__textarea">
                        <label className="form__label">
                            <span>Комментарии к заказу</span>
                            {edit && <textarea name="description" onChange={changeDesc} id="" cols={30} rows={3} value={desc}></textarea>}
                            {!edit && <textarea disabled name="description" value={desc} onChange={changeDesc} id="" cols={30} rows={3}></textarea>}
                        </label>
                    </div>

                </div>
                <div className={style.form__pay}>
                    <h3 className="form__title"><img src={urlIconPay} alt="pay" />Оплата</h3>
                    <label className="form__label">
                        <span>{data.total_incl_tax} ₽</span>
                        <input defaultValue={`${data.lines.length} ${declOfNum(data.lines.length)}`} type="text" disabled />
                    </label>
                    <label className="form__label">
                        <span>Способ оплаты</span>
                        <input defaultValue={"Кредитная карта"} type="text" disabled />
                    </label>
                </div>
                <div className={style.form__cart + " "}>
                    <h3 className="form__title"><img src={urlIconCart} alt="cart" />Детали заказа</h3>
                    <div className={style.order + " " + (isScroll ? "scroll__elem" : "")} ref={refOrder}>
                        {data.lines.map((item, index) => <div key={index} className={style.infoOrder}>

                            <TitleProduct active={true} categories={item.product.categories} images={item.product.images} title={item.product.title} ></TitleProduct>
                            <p className={style.infoPace}> {item.product.location ? item.product.location : "Не заполнено"}</p>


                            <div className={style.infoCount}>
                                <span>x {item.quantity} </span>
                                <span>{item.unit_price_incl_tax} ₽ / шт</span>
                            </div>
                        </div>
                        )}


                    </div>

                </div>
                <input type="submit" value="Отправить" className="form__submit" ref={refBtn} />

            </form>
        </>
    )
}

export default OrderForm