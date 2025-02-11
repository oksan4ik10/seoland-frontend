/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import ReactInputMask from "react-input-mask";

import style from "./DavdamerForm.module.css"

import urlIconGeneral from "../../assets/images/genetalIcon.svg"
import urlFileImg from "../../assets/images/default-create.png"


import { IDavdamerInfo } from "../../models/type";
import { useRef, useState } from "react";



interface IProps {
    data?: IDavdamerInfo
    id?: string | null,
    funcRequest?: any,
    refBtn: any,
}



function DavdamerForm(props: IProps) {
    const { data, funcRequest, id, refBtn } = props;


    const inputFile = useRef<HTMLInputElement>(null);

    const [fileInfo, setFileInfo] = useState<File>();

    const [uploadFile, setUploadFile] = useState<string>();
    const [errorFile, setErrorFile] = useState("");


    const addFakeFile = () => {

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
            first_name: (data && data.first_name) ? data.first_name : "",
            last_name: (data && data.last_name) ? data.last_name : "",
            email: (data && data.email) ? data.email : "",
            phone_number: (data && data.phone_number) ? data.phone_number : "",
            password: (data && data.password) ? data.password : "",
        }
    })

    const [errorsPassword, setErrorsPassword] = useState<string[]>([]);



    const navigate = useNavigate();

    const onSubmit: SubmitHandler<any> = async (dataParam) => {


        const formData = new FormData();

        for (const key in dataParam) {

            formData.append(key, dataParam[key] as any)
        }
        if (fileInfo) formData.append("image", fileInfo);


        if (!id) {

            try {
                if (funcRequest) {
                    const data = await funcRequest({ body: formData });

                    if (data.error) {
                        if (data.error.data.password) setErrorsPassword(data.error.data.password)
                        else navigate(`/404`)
                        return
                    }
                    navigate(`/davdamers`)
                }
            }
            catch {
                navigate(`/404`)

            }
        } else {

            try {
                if (data) {
                    const dataRequest = await funcRequest({ id: data.id, body: formData });
                    if (dataRequest.error) {
                        if (dataRequest.error.data.password) setErrorsPassword(dataRequest.error.data.password)
                        else navigate(`/404`)
                    }
                    navigate(`/davdamers`)
                }

            } catch {
                navigate(`/404`)

            }

        }
    }

    return (
        <>
            <form className={'form ' + " " + style.form} encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                <div className="form__head">
                    <div className="form__file">
                        <div onClick={addFakeFile} className="form__addFile">
                            <img src={(uploadFile && !errorFile) ? uploadFile : (!data || !data.image) ? urlFileImg : data.image} alt="addFile" />
                            {errorFile && <span className="form__error">{errorFile}</span>}
                        </div>
                        <input accept="image/png, image/jpeg" type="file" {...register("image")} id="" ref={inputFile} onChange={fileChange} />

                    </div>
                    <div className="form__name">
                        <div className={"form__label"}>
                            <span>Фамилия</span>
                            <input placeholder="Заполните фамилию" type="text"  {...register("last_name", { validate: (value) => ((value.length > 2) && (value.length < 21)) })} />
                            {errors.last_name && <span className="form__error">Длина строки от 3 до 20 символов</span>}
                        </div>
                        <div className={"form__label"}>
                            <span>Имя</span>
                            <input placeholder="Заполните имя" type="text"  {...register("first_name", { validate: (value) => ((value.length > 2) && (value.length < 21)) })} />
                            {errors.first_name && <span className="form__error">Длина строки от 3 до 20 символов</span>}
                        </div>
                    </div>
                </div>
                <div className={style.form__general}>
                    <h3 className="form__title"><img src={urlIconGeneral} alt="desc" />Общее</h3>
                    {data && <div className={"form__label"}>
                        <span>ID</span>
                        <input placeholder="Заполните фамилию" type="text" value={data.id} disabled />

                    </div>}

                    <div className={"form__label"}>
                        <span>Телефон</span>
                        <ReactInputMask
                            mask={"+7(999)999-99-99"}
                            alwaysShowMask={false}
                            maskPlaceholder=''
                            type={'text'}
                            placeholder="+7(999)999-99-99"
                            {...register("phone_number", { validate: (value) => value.length > 15 })}
                        />
                        {errors.phone_number && <span className="form__error">Некорретный телефон</span>}
                    </div>


                    <div className={"form__label"}>
                        <span>E-mail</span>
                        <input placeholder="Заполните email" type="text"  {...register("email", { validate: (value) => ((value.length > 2)), pattern: /^\S+@\S+\.\S+$/ })} />
                        {errors.email && <span className="form__error">Некорретный email</span>}
                    </div>
                    <div className={"form__label"}>
                        <span>Пароль</span>
                        <input placeholder="Заполните пароль" type="text"  {...register("password", { validate: (value) => ((value.length > 7) && (value.length < 21)) })} />
                        {errors.password && <span className="form__error">Длина строки от 8 до 20 символов</span>}
                        {(errorsPassword.length > 0) && errorsPassword.map((item) => <span className="form__error">{item}</span>)}
                    </div>


                    <input type="submit" value="Отправить" className="form__submit" ref={refBtn} />
                </div>



            </form>
        </>
    )
}

export default DavdamerForm