/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ClampLines from 'react-clamp-lines';

import moment from "moment";
import styles from "./TablePage.module.css";


import { useMatchMedia } from "../../hooks/use-match-media";
import { IDavdamerInfo, IOrder, IProduct, ISeller } from "../../models/type";
import Pages from "../PagesHead/PagesHead";

import { statusOrder } from "../../models/type";
import { statusOrderColor } from "../../models/type";
import Filter from "../Filter/Filter";
import TitleProduct from "../TitleProduct/TitleProduct";

import Modal from "../Modal/Modal";
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import { useAppSelector } from "../../store/store";
// import { davDamerAPI } from "../../store/api/DavdamerAPI";



type TSortingState = "asc" | "desc" | "none"
interface IColumns {
    nameColumn: string,
    stateSort: TSortingState,
    nameResponse: string
}

interface ITable {
    nameColumns: {
        nameColumn: string,
        nameResponse: string
    }[],
    countRow: number,
    title: string,
    filterParams: {
        title: string,
        filter: string,
        type?: "date",
        id?: boolean
    }[]
}

interface ITables {
    davdamers: ITable,
    sellers: ITable,
    products: ITable,
    orders: ITable
}



const dataTables: ITables = {
    davdamers: {
        title: "Давдамеры",
        nameColumns: [{ nameColumn: "ID", nameResponse: "id" }, { nameColumn: "Имя", nameResponse: "fullName" }, { nameColumn: "Телефон", nameResponse: "phone__number" }, { nameColumn: "E-mail", nameResponse: "email" }, { nameColumn: "Дата регистрации", nameResponse: "registered_dt" }],
        countRow: 4,
        filterParams: []
    },
    sellers: {
        title: "Продавцы",
        nameColumns: [{ nameColumn: "Наименование", nameResponse: "name" }, { nameColumn: "Адрес", nameResponse: "full_address" }, { nameColumn: "Описание", nameResponse: "description" }, { nameColumn: "Кол-во товаров", nameResponse: "products_amount" }, { nameColumn: "Рейтинг", nameResponse: "rating" }, { nameColumn: "Сумма продаж", nameResponse: "orders_total" }],
        countRow: 4,
        filterParams: [{ title: "Страна", filter: "country" }, { title: "Город", filter: "city" }, { title: "Рынок", filter: "market" }, { title: "Адрес рынка", filter: "address" }]
    },
    products: {
        title: "Товары",
        nameColumns: [{ nameColumn: "Наименование", nameResponse: "title" }, { nameColumn: "Описание", nameResponse: "description" }, { nameColumn: "Продавец", nameResponse: "seller" }, { nameColumn: "Кол-во продаж", nameResponse: "orders_count" }, { nameColumn: "Стоимость", nameResponse: "price" }],
        countRow: 4,
        filterParams: [{ title: "Категория", filter: "category", }, { title: "Продавец", filter: "nameSeller", id: true }]
    },
    orders: {
        title: "Заказы",
        nameColumns: [{ nameColumn: "№ заказа", nameResponse: "number" }, { nameColumn: "Дата и время", nameResponse: "date_placed" }, { nameColumn: "Статус", nameResponse: "status" }, { nameColumn: "ID Клиента", nameResponse: "user" }, { nameColumn: "Сумма", nameResponse: "total" }],
        countRow: 4,
        filterParams: [{ title: "Статус", filter: "statusName" }, { title: "Дата заказа", filter: "date", type: "date" }]
    },

}

export interface IDataFilter {
    [key: string]: any,
}

type TNameTable = "sellers" | "products" | "orders" | "davdamers"
interface IStyle { [key: string]: string }
interface IProps {
    nameTable: TNameTable,
    sellers?: ISeller[],
    orders?: IOrder[],
    products?: IProduct[],
    davdamers?: IDavdamerInfo[],
    lengthRow: number,
    style: IStyle,
    setParamsFilter: (key: string, value: string | number) => void
    delItem?: any

}

function TablePage(props: IProps) {
    const { delItem, nameTable, orders, sellers, style, lengthRow, products, setParamsFilter, davdamers } = props;


    const [arrRowActive, setArrRowActive] = useState<boolean[]>(Array(lengthRow).fill(false));
    const [nameColumns, setNameColumns] = useState<IColumns[]>([]);


    const [dataFilters, setDataFilters] = useState<IDataFilter[]>()

    const getElemArrFilters = (data: any, item: any) => {
        const arr: any[] = [];
        if (item["id"]) {
            data.map((i: any) => {
                if (item.type === "date") return i
                const elem = i[item.filter];
                const indexArr = arr.findIndex((el) => el["id"] === elem["id"]);
                if (indexArr !== -1) return i
                arr.push(i[item.filter])
                return i
            })
        } else {
            data.map((i: any) => {
                if (item.type === "date") return i
                const elem = i[item.filter].toLocaleString();

                if (arr.indexOf(elem) === -1) arr.push(elem)
                return i
            })
        }
        return arr

    }

    useEffect(() => {

        setArrRowActive(Array(lengthRow).fill(false))
        setNameColumns(dataTables[nameTable].nameColumns.map((item) => {

            return {
                nameColumn: item.nameColumn,
                nameResponse: item.nameResponse,
                stateSort: "none"
            }
        }))
        setDataFilters(dataTables[nameTable].filterParams.map((item) => {
            const title = item.title;


            const keyFilter = item.filter;
            let arr: any[] = [];
            if (sellers) arr = getElemArrFilters(sellers, item)
            if (products) arr = getElemArrFilters(products, item)
            if (orders) arr = getElemArrFilters(orders, item)
            const type = item.type ? item.type : "";

            return Object.assign({ type: type }, { title: title }, { nameFilter: keyFilter }, { [keyFilter]: [...arr] }, { id: item.id })

        }))
    }, [lengthRow])


    const { isMobile } = useMatchMedia();
    const hasScroll = !isMobile && lengthRow > dataTables[nameTable].countRow;



    const clickRow = (id: number) => {
        if (arrRowActive)
            setArrRowActive(arrRowActive.map((_, index) => {
                if (index === id) return true;
                return false
            }));
    }
    const clickTable = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        if (target.closest(".row") && (!target.closest(".row__title"))) return;
        setArrRowActive(arrRowActive.map(() => false));

    }

    const clickColumn = (i: number) => {
        if (davdamers) return;
        const newArr = nameColumns.map((item, index) => {
            if (i === index) {
                item.stateSort = (item.stateSort === "none") ? "desc" : (item.stateSort === "desc") ? "asc" : "none";

                const str = (item.stateSort === "asc") ? item.nameResponse : (item.stateSort === "desc") ? `-${item.nameResponse}` : "";
                setParamsFilter("ordering", str);

            } else {
                item.stateSort = "none"
            }
            return item

        })
        setNameColumns(newArr);
    }



    const deleteProduct = (id: any) => {
        if (delItem) return delItem(id);

    }
    const [idDelProduct, setIdDelProduct] = useState<number>();
    const [textModalDel, setTextModalDel] = useState("");
    const clickDel = (id: number, str: string) => {
        setTextModalDel(str);
        setIdDelProduct(id);
        disablePageScroll();
    }
    const closeModal = () => {
        setIdDelProduct(undefined);
        enablePageScroll()
    }

    const idAdmin = useAppSelector((store) => store.userReducer).user.id;

    const inputSearch = useRef<HTMLInputElement>(null)
    const clickSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputSearch.current) return

        const value = inputSearch.current.value;
        setParamsFilter("title", value);


    }
    const cancelSearch = () => {
        if (!inputSearch.current) return
        setParamsFilter("title", "");
        inputSearch.current.value = ""
    }



    return (
        <div onClick={clickTable} className={styles.table}>
            {idDelProduct && <Modal text={textModalDel} funcRequest={deleteProduct} id={idDelProduct} closeModal={closeModal}></Modal>}
            <Pages title={dataTables[nameTable].title} />
            <div className={styles.head__table + " " + (sellers ? styles.sellersHead : "")}>
                <div className={styles.btnHead}>
                    {(davdamers || sellers || products) && <Link to={`/${nameTable}/create`} className={"btn__head btn__active " + styles.btn}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M19 12.998H13V18.998H11V12.998H5V10.998H11V4.99805H13V10.998H19V12.998Z" fill="white" />
                        </svg>
                        <span>Добавить</span>
                    </Link>}
                </div>
                {(sellers || products) && <form className={styles.search} onSubmit={(e) => clickSearch(e)}>
                    <input type="text" className={styles.searchTerm} placeholder="Поиск..." ref={inputSearch} />
                    <button className={styles.searchButton} type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="20px" height="20px" fill="white"><path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" /></svg>
                    </button>
                </form>}
                <div className={styles.head__filters}>
                    {dataFilters && dataFilters.map((item, index) => <Filter setParamsFilter={setParamsFilter} key={index} data={item}></Filter>)}
                </div>

            </div>

            <div className="page__tables">
                <div className="page__panel">

                    <div className="filters"></div>
                </div>
                {((sellers && sellers.length === 0) || (products && products.length === 0)) && <p className={styles.text}>Данные не найдены. <span onClick={cancelSearch}>Сбросить поиск</span></p>}

                {((sellers && sellers.length > 0) || (davdamers && davdamers.length > 0) || (products && products.length > 0) || (orders && orders.length > 0)) && <div className="tables">
                    <div className={"row row__title " + style.row}>
                        {nameColumns && nameColumns.map((item, index) => {
                            return <div className={"col__title " + (item.stateSort === "asc" ? "desc" : "") + " " + (item.stateSort === "none" ? "" : "active")} key={index} onClick={() => clickColumn(index)}>

                                {item.nameColumn}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M2 12V10.6667H6V12H2ZM2 8.66667V7.33333H10V8.66667H2ZM2 5.33333V4H14V5.33333H2Z" />
                                </svg>

                            </div>

                        })}
                        <div className="col__title"></div>
                    </div>
                    <div style={{ height: hasScroll ? '60vh' : 'auto', minHeight: '80%', paddingRight: "20px" }} className="tables__wrapper scroll__elem">
                        {sellers && sellers.length > 0 && sellers.map((item, index) =>
                            <div className={"row " + style.row} onClick={() => clickRow(index)} key={item.id}>
                                <div className={"row__bg " + ((arrRowActive && arrRowActive[index]) ? "active" : "")}></div>
                                <div className={"col " + style.col}>
                                    <ClampLines text={item.name} lines={2} className={style.col__nameName} ellipsis="" id="custom" buttons={false} /></div>
                                <div className={"col " + style.col}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14" viewBox="0 0 11 14" fill="#3977F1">
                                        <path d="M5.33333 11.9C6.68889 10.6555 7.69445 9.52498 8.35 8.50831C9.00556 7.49165 9.33333 6.58887 9.33333 5.79998C9.33333 4.58887 8.94722 3.5972 8.175 2.82498C7.40278 2.05276 6.45556 1.66665 5.33333 1.66665C4.21111 1.66665 3.26389 2.05276 2.49167 2.82498C1.71944 3.5972 1.33333 4.58887 1.33333 5.79998C1.33333 6.58887 1.66111 7.49165 2.31667 8.50831C2.97222 9.52498 3.97778 10.6555 5.33333 11.9ZM5.33333 13.6666C3.54444 12.1444 2.20833 10.7305 1.325 9.42498C0.441667 8.11942 0 6.91109 0 5.79998C0 4.13331 0.536111 2.80554 1.60833 1.81665C2.68056 0.827757 3.92222 0.333313 5.33333 0.333313C6.74444 0.333313 7.98611 0.827757 9.05833 1.81665C10.1306 2.80554 10.6667 4.13331 10.6667 5.79998C10.6667 6.91109 10.225 8.11942 9.34167 9.42498C8.45833 10.7305 7.12222 12.1444 5.33333 13.6666ZM3.33333 7.66665H4.66667V5.83331H6V7.66665H7.33333V4.49998L5.33333 3.16665L3.33333 4.49998V7.66665Z" fill="#3977F1" />
                                    </svg>
                                    <div className={style.col__address}>
                                        {item.country && <span>
                                            {item.country ? item.country : "пусто"}
                                        </span>}
                                        {item.city && <span>
                                            {item.city}
                                        </span>}
                                        <ClampLines className={style.col__addressName} text={item.address} lines={1} ellipsis="..." id="custom" buttons={false} />
                                    </div>

                                </div>
                                <div className="col">
                                    <ClampLines className={style.col__addressDesc} text={item.description ? item.description : "(пусто)"} lines={4} ellipsis="..." id="custom" buttons={false} /></div>
                                <div className={"col " + style.col}>
                                    {item.products_amount ? item.products_amount.toLocaleString() : 0}
                                </div>
                                <div className={"col " + style.col}>
                                    <span>{item.rating ? item.rating : 0}</span>
                                    {item.rating && <span className={style.col__raiting + ((Number(item.rating) < 3) ? style.col__raitingError : (Number(item.rating) < 4) ? style.col__raitingWait : "")} style={{ "--width-raiting": item.rating } as React.CSSProperties}></span>}
                                </div>
                                <div className={"col " + style.col}>{(item.orders_total ? item.orders_total : 0) + " ₽"}</div>
                                <div className={"col " + style.col}>
                                    <Link to={`/sellers/${item.id}`} className="btn btn__table">
                                        Перейти
                                    </Link>
                                </div>
                            </div>
                        )}

                        {products && products.length > 0 && products.map((item, index) => {
                            return <div className={"row " + style.row} onClick={() => clickRow(index)} key={item.id}>
                                <div className={"row__bg " + ((arrRowActive && arrRowActive[index]) ? "active" : "")}></div>
                                <TitleProduct active={arrRowActive[index]} categories={item.categories} images={item.images} title={item.title} ></TitleProduct>
                                <div className={"col " + style.col + " " + style.col__desc}>
                                    <ClampLines text={item.description ? item.description.replace(/<\/?[a-zA-Z]+>/gi, '') : "(пусто)"} lines={3} ellipsis="" id="custom" buttons={false} />
                                </div>
                                <div className={"col " + style.col + " " + style.col__seller}>
                                    <ClampLines text={item.seller.name} lines={2} ellipsis="q223" id="custom" buttons={false} />
                                </div>
                                <div className={"col " + style.col + " " + style.col__count}>
                                    {item.orders_count}
                                </div>
                                <div className={"col " + style.col + " " + style.col__count}>

                                    {(+item.price.incl_tax).toFixed(2).toLocaleString() + " ₽"}
                                </div>
                                <div className={"col " + style.col}>
                                    <Link to={`/products/${item.id}`} className="btn btn__table">
                                        Перейти
                                    </Link>
                                    <button onClick={() => clickDel(item.id, "Удалить товар?")} className="btn btn__table btn__error">
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        })}

                        {orders && orders.length > 0 && orders.map((item, index) => {
                            return <div className={"row " + style.row} onClick={() => clickRow(index)} key={item.id}>
                                <div className={"row__bg " + ((arrRowActive && arrRowActive[index]) ? "active" : "")}></div>
                                <div className={"col " + style.col}>{item.number}</div>
                                <div className={"col " + style.col}>
                                    <span>{moment(item.date_placed).format("DD.MM.YYYY")}</span>
                                    <span>{moment(item.date_placed).format("HH:mm")}</span></div>
                                <div className={"col " + style.col} style={{ background: statusOrderColor[item.status.toUpperCase()] }}>{statusOrder[item.status.toUpperCase()]}</div>
                                <div className={"col " + style.col}>{item.user.id}</div>
                                <div className={"col " + style.col}>{item.total_incl_tax + " ₽"}</div>
                                <div className={"col " + style.col}>
                                    <Link to={`/orders/${item.id}`} className="btn btn__table">
                                        Перейти
                                    </Link>
                                </div>
                            </div>

                        })}

                        {davdamers && davdamers.length > 0 && davdamers.map((item, index) => <div className={"row " + style.row} onClick={() => clickRow(index)} key={item.id}>
                            <div className={"row__bg " + ((arrRowActive && arrRowActive[index]) ? "active" : "")}></div>
                            <div className="col">
                                <span className={style.col__addressDesc}>{item.id ? item.id : "(не заполнено)"}</span>
                            </div>
                            <div className="col">
                                <span className={style.col__addressDesc}>{item.fullName.trim() ? item.fullName : "(не заполнено)"}</span>
                            </div>
                            <div className="col">
                                <span className={style.col__addressDesc}>{item.phone_number ? item.phone_number : "(не заполнено)"}</span>
                            </div>
                            <div className={"col " + style.colEmail}>
                                <span className={style.col__addressDesc + " "}>{item.email}</span>
                            </div>
                            <div className={"col " + style.date}>
                                <span>{moment(item.registered_dt).format("DD.MM.YYYY")}</span>
                                <span>{moment(item.registered_dt).format("HH:mm")}</span>

                            </div>
                            <div className={"col " + style.col}>
                                <Link to={`/davdamers/edit/${item.id}`} className="btn btn__table">
                                    Редактировать
                                </Link>
                                {item.id !== idAdmin && <button onClick={() => clickDel(item.id, "Удалить давдамера?")} className="btn btn__table btn__error">
                                    Удалить
                                </button>}
                            </div>
                        </div>)}
                    </div>
                </div>}
            </div >



        </div>
    )
}

export default TablePage