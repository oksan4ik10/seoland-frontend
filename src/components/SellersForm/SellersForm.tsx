/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { useRef, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom";

import ReactInputMask from "react-input-mask";

import "./SellersForm.css"

import urlFileImg from "../../assets/images/default-create.png"
import urlFileShowImg from "../../assets/images/default-show.png"
import urlIconAdress from "../../assets/images/home_pin.svg"
import urlIconDesc from "../../assets/images/descIcon.svg"
import { ISeller } from "../../models/type";


interface IProps {
    edit: boolean,
    data?: ISeller
    id?: string | null,
    refBtn: any,
    funcRequest?: any
}



function SellersForm(props: IProps) {
    const { edit, data, id, refBtn, funcRequest } = props;

    const inputFile = useRef<HTMLInputElement>(null);

    const [fileInfo, setFileInfo] = useState<File>();

    const [uploadFile, setUploadFile] = useState<string>();
    const [errorFile, setErrorFile] = useState("");


    const addFakeFile = () => {
        if (!edit) return;
        if (inputFile.current) inputFile.current.click();
    }
    const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const target = e.target as HTMLInputElement;
        const files = (target.files) ? target.files[0] : "";
        if (files) {
            if (!/\.(jpe?g|png|gif)$/i.test(files.name)) {
                setErrorFile("Неверный формат");
                return
            }
            setErrorFile("");
            setFileInfo(files)
            const reader = new FileReader();
            reader.addEventListener("load", function () {

                setUploadFile(this.result as string);
            });

            reader.readAsDataURL(files);
        }
    }

    const { register, handleSubmit, formState: { errors } } = useForm<any>({
        defaultValues: {
            name: (data && data.name) ? data.name : edit ? "" : "Не заполнено",
            country: 'Россия',
            city: (data && data.city) ? data.city : edit ? "" : "Не заполнено",
            market: (data && data.market) ? data.market : edit ? "" : "Не заполнено",
            address: (data && data.address) ? data.address : edit ? "" : "Не заполнено",
            telegram_chat_id: (data && data.telegram_chat_id) ? data.telegram_chat_id : edit ? "" : "Не заполнено",
            card_number: (data && data.card_number) ? data.card_number : edit ? "" : "Не заполнено",
            card_name: (data && data.card_name) ? data.card_name : edit ? "" : "Не заполнено",
            card_bank: (data && data.card_bank) ? data.card_bank : edit ? "" : "Не заполнено"
        }
    })


    const navigate = useNavigate();
    const onSubmit: SubmitHandler<any> = async (data) => {
        const formData = new FormData();
        if (errorFile) return


        if (fileInfo) formData.append("image", fileInfo);
        if (desc) formData.append("description", desc);
        for (const key in data) {
            if (data[key]) formData.append(key, data[key] as any)
        }
        if (!id) {
            try {
                if (funcRequest) {
                    const data = await funcRequest(formData)
                    if (data.error) return
                    navigate(`/sellers`)
                }
            } catch (err) {
                navigate(`/404`)
            }


        } else {
            try {
                if (funcRequest) {
                    const data = await funcRequest({ id: id, body: formData })
                    if (data.error) return
                    navigate(`/sellers`)
                }
            } catch (err) {
                navigate(`/404`)

            }

        }
    }

    const [desc, setDesc] = useState((data && data.description) ? data.description : "");
    const changeDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDesc(e.target.value);
    }

    return (
        <>
            <form className={'form ' + (edit ? "" : "show")} encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                <div className="form__head">
                    <div className="form__file">
                        <div onClick={addFakeFile} className="form__addFile">
                            <img src={(uploadFile && !errorFile) ? uploadFile : ((edit && !data) || (edit && (data && !data.image))) ? urlFileImg : ((data) && (data.image)) ? data.image : urlFileShowImg} alt="addFile" />
                            {errorFile && <span className="form__error">{errorFile}</span>}
                        </div>
                        <input accept="image/png, image/jpeg" type="file" {...register("image")} id="" ref={inputFile} onChange={fileChange} />

                    </div>
                    <label className="form__name form__label">
                        {edit && <span>Название</span>}
                        <input placeholder="Заполните название" type="text"  {...register("name", { validate: (value) => ((value.length > 2) && (value.length < 15)), disabled: edit ? false : true })} />
                        {data && data.registered_dt && !edit && <span>Дата регистрации: {moment.utc(data.registered_dt).utcOffset("-0500").format("DD.MM.YYYY")}</span>}
                        {errors.name && <span className="form__error">Длина строки от 2 до 15 символов</span>}
                    </label>
                </div>
                <div className="form__adress">
                    <h3 className="form__title"><img src={urlIconAdress} alt="desc" />Адрес</h3>
                    <div className="form__label">
                        <span>Страна</span>
                        <input placeholder="Укажите страну" type="text" {...register("country", {
                            disabled: true
                        })} />
                        {errors.country && <span className="form__error">Неверно введена страна</span>}
                    </div>
                    <div className="form__label">
                        <span>Город</span>
                        <input placeholder="Укажите город" type="text"  {...register("city", { validate: (value) => ((value.length > 2) && (value.length < 50)), disabled: edit ? false : true })} />
                        {errors.city && <span className="form__error">Длина строки от 2 до 50 символов</span>}
                    </div>
                    <div className="form__label">
                        <span>Рынок</span>
                        <input placeholder="Укажите рынок" type="text"  {...register("market", { validate: (value) => ((value.length > 2) && (value.length < 50)), disabled: edit ? false : true })} />
                        {errors.market && <span className="form__error">Длина строки от 2 до 50 символов</span>}
                    </div>
                    <div className="form__label">
                        <span>Адрес рынка</span>
                        <input placeholder="Укажите адрес рынка" type="text"  {...register("address", { validate: (value) => ((value.length > 2) && (value.length < 120)), disabled: edit ? false : true })} />
                        {errors.address && <span className="form__error">Длина строки от 2 до 120 символов</span>}
                    </div>
                </div>
                <div className="form__desc">
                    <h3 className="form__title"> <img src={urlIconDesc} alt="desc" />Описание</h3>
                    <div className={"form__label "}>
                        <span>ID продавца в Telegram</span>
                        {/* {!edit && data && <span className={"spanName"}>{data.telegram_chat_id}</span>} */}
                        <input placeholder="ID" type="number"  {...register("telegram_chat_id", {
                            validate: (value) => ((value > 999)), disabled: edit ? false : true
                        }
                        )} />
                        {errors.telegram_chat_id && <span className="form__error">Введите число больше 4 знаков</span>}
                    </div>

                    <div className="form__label">
                        <span>Номер карты продавца</span>
                        <ReactInputMask
                            mask={"9999 9999 9999 9999"}
                            alwaysShowMask={false}
                            maskPlaceholder=''
                            type={'text'}
                            placeholder="9999 9999 9999 9999"
                            {...register("card_number", { validate: (value) => value.length > 18, disabled: edit ? false : true })}
                        />
                        {errors.card_number && <span className="form__error">Неверный номер карты</span>}


                    </div>
                    <div className="form__label">
                        <span>Имя владельца карты</span>
                        <input placeholder="Укажите владельца карты" type="text"  {...register("card_name", {
                            minLength: { value: 3, message: 'Длина строки от 3 символов' },
                            validate: (value) => /^[A-Z]+(\s[A-Z]+)?$/.test(value)


                        })} />
                        {errors.card_name && <span className="form__error">Имя владельца должно быть заглавными латинскими буквами. Длина строки от 3 символов</span>}
                    </div>
                    <div className="form__label">
                        <span>Название банка </span>
                        <input placeholder="Укажите название банка" type="text"  {...register("card_bank", { validate: (value) => ((value.length > 2) && (value.length < 120)), disabled: edit ? false : true })} />
                        {errors.card_bank && <span className="form__error">Длина строки от 3 до 120 символов</span>}
                    </div>
                    <div className="form__textarea">
                        <label className="form__label">
                            <span>Общее описание продавца (что продает и т.д.)</span>
                            {edit && <textarea name="description" onChange={changeDesc} id="" cols={30} rows={5} value={desc}></textarea>}
                            {!edit && <textarea disabled name="description" value={desc} onChange={changeDesc} id="" cols={30} rows={5}></textarea>}
                        </label>
                    </div>

                </div>
                <input type="submit" value="Отправить" className="form__submit" ref={refBtn} />

            </form>
        </>
    )
}

export default SellersForm