/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form"

import { ILoginAPI } from '../../models/type';

import { davDamerAPI } from '../../store/api/DavdamerAPI';

import style from "./LoginPage.module.css"

import { useAppDispatch } from '../../store/store';
import { setUser } from '../../store/reducer/userReducer';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { register, handleSubmit, formState: { errors } } = useForm<any>()
    const dispatch = useAppDispatch();

    const fromPage = location.state?.from?.pathname || '/';


    const [auth] = davDamerAPI.useFetchLoginMutation();

    const [error, setError] = useState(false);

    const onSubmit: SubmitHandler<ILoginAPI> = async (dataParam) => {

        const obj: ILoginAPI = {
            login: dataParam.login,
            password: dataParam.password
        };


        try {
            const data = await auth(obj);
            if ("error" in data) {
                setError(true);
                return
            }
            dispatch(setUser(data.data))
            navigate(fromPage, { replace: true })
        } catch (e) {
            setError(true);
        }
    }

    return (
        <div className={style.form + " form"}>
            <div className={style.formWrapper}>
                <h1>Авторизация</h1>
                <form onSubmit={handleSubmit(onSubmit)} className={style.formElem}>
                    <label className='form__label form__name'>
                        <span>Логин:</span>
                        <input autoComplete="username" placeholder='Введите логин' {...register("login", { validate: (value) => (value.length > 0) })} />
                        {errors.username && <span className="form__error">Заполните поле логин</span>}
                    </label>
                    <label className='form__label form__name'>
                        <span>Пароль:</span>
                        <input autoComplete="current-password" placeholder="Введите пароль" type='password' {...register("password", { validate: (value) => (value.length > 3) })} />
                        {errors.password && <span className="form__error">Длина пароля от 4 символов</span>}
                    </label>
                    <span className={"form__error " + " " + style.form__error + " " + (error ? style.errorNone : "")}>Неверно введен логин или пароль</span>
                    <button type="submit" className='btn__active btn__head'>Войти</button>
                </form>
            </div>

        </div>
    )
}

export { LoginPage };
