
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "./DirectoryMain.module.css";

import { paramsFilterAttr } from "../paramsFilterAttr";


import { davDamerAPI } from "../../../store/api/DavdamerAPI";
import { useMatchMedia } from "../../../hooks/use-match-media";


import { disablePageScroll, enablePageScroll } from 'scroll-lock';

import Filter from "../../../components/Filter/Filter";
import Pages from "../../../components/PagesHead/PagesHead";

import styles from "./DirectoryMain.module.css"
import Modal from "../../../components/Modal/Modal";

import { useAppSelector, useAppDispatch } from "../../../store/store";

import { setAttr } from "../../../store/reducer/attrReducer";


function DirectoryMain() {


    const codeAttr: string = useAppSelector((store) => store.attrReducer).attr;
    const dispatch = useAppDispatch();

    const { data, error, isLoading } = davDamerAPI.useFetchGetAttributesQuery({ code: codeAttr });

    const [dataFilter, setDataFilter] = useState(paramsFilterAttr);

    useEffect(() => {
        const newTitle = dataFilter.attr.find((item) => item.id === codeAttr)?.name;
        setDataFilter((item) => {
            const obj = Object.assign({}, item)
            obj.title = newTitle ? newTitle : "Цвет"
            return obj

        })

    }, [])

    const setParamsFilter = (_: string, value: string) => {
        if (!value) value = "color";
        dispatch(setAttr(value))
    }

    const { isMobile } = useMatchMedia();
    const [hasScroll, setHasScroll] = useState(false);
    useEffect(() => {
        setHasScroll(!isMobile && ((data ? data.length : 0) > 5))
    })



    const [deleteProduct] = davDamerAPI.useFetchDelAttrMutation();

    const [idDelProduct, setIdDelProduct] = useState<number>();
    const clickDel = (id: number) => {
        setIdDelProduct(id);
        disablePageScroll();
    }
    const closeModal = () => {
        setIdDelProduct(undefined);
        enablePageScroll()
    }



    if (isLoading) return (<p>Загрузка данных</p>)
    if (error) return (<p>Ошибка</p>)

    return <>
        <div className={styles.table}>
            {idDelProduct && <Modal text="Удалить атрибут?" funcRequest={deleteProduct} id={idDelProduct} closeModal={closeModal}></Modal>}
            <Pages title={"Аттрибуты"} />
            <div className={style.wrapper__head}>
                <div className={styles.head__table}>
                    <div>
                        <Link to={`/attributes/create`} className={"btn__head btn__active " + styles.btn}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                                <path d="M19 12.998H13V18.998H11V12.998H5V10.998H11V4.99805H13V10.998H19V12.998Z" fill="white" />
                            </svg>
                            <span>Добавить</span>
                        </Link>

                    </div>
                    <Filter data={dataFilter} setParamsFilter={setParamsFilter}></Filter>


                </div>
            </div>


            <div className={"page__tables " + style.page__tables}>
                <div className="tables">
                    <div className={"row row__title " + style.row}>


                        <div className="col__title">Наименование</div>
                        <div className="col__title">Значение</div>
                    </div>
                    <div style={{ height: hasScroll ? '60vh' : 'auto', minHeight: '80%' }} className="tables__wrapper scroll__elem">

                        {data && data.length > 0 && data.map((item) => <div className={"row " + style.row} key={item.id}>

                            <div className="col">
                                <span className={style.col__addressDesc}>{item.label}</span>
                            </div>
                            <div className="col">
                                <span className={style.col__addressDesc}>{item.value}</span>
                            </div>

                            <div className={"col " + style.col}>
                                <Link to={`/attributes/edit/${item.id}`} className="btn btn__table">
                                    Редактировать
                                </Link>
                                <button onClick={() => clickDel(item.id)} className="btn btn__table btn__error">
                                    Удалить
                                </button>
                            </div>
                        </div>)}
                    </div>
                </div>
            </div >



        </div>
    </>
}

export default DirectoryMain