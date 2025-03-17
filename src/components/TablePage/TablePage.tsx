/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ClampLines from 'react-clamp-lines';

import moment from "moment";
import styles from "./TablePage.module.css";


import { useMatchMedia } from "../../hooks/use-match-media";
import { IDavdamerInfo, IProject, ISeller, ITask, IWorker } from "../../models/type";
import Pages from "../PagesHead/PagesHead";

import { statusOrderColor } from "../../models/type";
import Filter from "../Filter/Filter";


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
    projects: ITable,
    tasks: ITable,
    workers: ITable
}



const dataTables: ITables = {
    workers: {
        title: "Сотрудники",
        nameColumns: [{ nameColumn: "ID", nameResponse: "_id" }, { nameColumn: "Ф.И.О.", nameResponse: "name" }, { nameColumn: "Логин", nameResponse: "login" }, { nameColumn: "Роль", nameResponse: "email" }],
        countRow: 4,
        filterParams: []
    },
    davdamers: {
        title: "Давдамеры",
        nameColumns: [{ nameColumn: "ID", nameResponse: "id" }, { nameColumn: "Имя", nameResponse: "fullName" }, { nameColumn: "Телефон", nameResponse: "phone__number" }, { nameColumn: "E-mail", nameResponse: "email" }, { nameColumn: "Дата регистрации", nameResponse: "registered_dt" }],
        countRow: 4,
        filterParams: [{ title: "Страна", filter: "country" }]
    },
    sellers: {
        title: "Продавцы",
        nameColumns: [{ nameColumn: "Наименование", nameResponse: "name" }, { nameColumn: "Адрес", nameResponse: "full_address" }, { nameColumn: "Описание", nameResponse: "description" }, { nameColumn: "Кол-во товаров", nameResponse: "products_amount" }, { nameColumn: "Рейтинг", nameResponse: "rating" }, { nameColumn: "Сумма продаж", nameResponse: "orders_total" }],
        countRow: 4,
        filterParams: [{ title: "Страна", filter: "country" }, { title: "Город", filter: "city" }, { title: "Рынок", filter: "market" }, { title: "Адрес рынка", filter: "address" }]
    },
    projects: {
        title: "Проекты",
        nameColumns: [{ nameColumn: "Наименование", nameResponse: "name" }, { nameColumn: "Время по плану", nameResponse: "timePlan" }, { nameColumn: "Описание", nameResponse: "desc" }, { nameColumn: "Дата начала", nameResponse: "date_start" }, { nameColumn: "Дата окончания", nameResponse: "date_end" }, { nameColumn: "Ответственный", nameResponse: "workerName" }],
        countRow: 4,
        filterParams: [{ title: "Дата начала проекта", filter: "date_start", type: "date" }]
    },
    tasks: {
        title: "Задачи",
        nameColumns: [{ nameColumn: "Наименование", nameResponse: "name" }, { nameColumn: "Проект", nameResponse: "projectName" },{ nameColumn: "Статус", nameResponse: "status" }, { nameColumn: "Дата начала", nameResponse: "date_start" }, { nameColumn: "Дата окончания по плану", nameResponse: "date_PlanEnd" }, { nameColumn: "Время по плану", nameResponse: "timePlan" }, { nameColumn: "Сотрудник", nameResponse: "workerName" }],
        countRow: 4,
        filterParams: [{ title: "Статус", filter: "status" }, { title: "Проект", filter: "project", id: true }]
    },

}

export interface IDataFilter {
    [key: string]: any,
}

type TNameTable = "sellers" | "projects" | "tasks" | "davdamers"|"workers"
interface IStyle { [key: string]: string }
interface IProps {
    nameTable: TNameTable,
    sellers?: ISeller[],
    tasks?: ITask[],
    projects?: IProject[],
    davdamers?: IDavdamerInfo[],
    workers?:IWorker[],
    lengthRow: number,
    style: IStyle,
    setParamsFilter: (key: string, value: string | number) => void
    delItem?: any

}

function TablePage(props: IProps) {
    const { delItem, nameTable, tasks, workers, style, lengthRow, projects, setParamsFilter, davdamers } = props;


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
                console.log(i[item.filter]);
                
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
            if (workers) arr = getElemArrFilters(workers, item)
            if (projects) arr = getElemArrFilters(projects, item)
            if (tasks) arr = getElemArrFilters(tasks, item)
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
        console.log(i);
        
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
            <div className={styles.head__table + " " + (workers ? styles.sellersHead : "")}>
                <div className={styles.btnHead}>
                    {(davdamers || workers || projects) && <Link to={`/${nameTable}/create`} className={"btn__head btn__active " + styles.btn}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M19 12.998H13V18.998H11V12.998H5V10.998H11V4.99805H13V10.998H19V12.998Z" fill="white" />
                        </svg>
                        <span>Добавить</span>
                    </Link>}
                </div>
                {workers  && <form className={styles.search} onSubmit={(e) => clickSearch(e)}>
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
                {((workers && workers.length === 0) || (projects && projects.length === 0)) && <p className={styles.text}>Данные не найдены. <span onClick={cancelSearch}>Сбросить поиск</span></p>}

                {((workers && workers.length > 0) || (davdamers && davdamers.length > 0) || (projects && projects.length > 0) || (tasks && tasks.length > 0)) && <div className="tables">
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
                        {workers && workers.length > 0 && workers.map((item, index) =>
                            <div className={"row " + style.row} onClick={() => clickRow(index)} key={item._id}>
                                <div className={"row__bg " + ((arrRowActive && arrRowActive[index]) ? "active" : "")}></div>
                                <div className="col">
                                    {item._id.slice(0,10)}
                                    </div>
                                <div className={"col " + style.col}>
                                    <ClampLines text={item.name} lines={2} className={style.col__nameName} ellipsis="" id="custom" buttons={false} /></div>
                                <div className={"col " + style.col}>
                                    {item.login}   
                                </div>
                                <div className={"col " + style.col}>
                                    {item.roleName}
                                </div>
                                
                                <div className={"col " + style.col}>
                                    <Link to={`/workers/${item._id}`} className="btn btn__table">
                                        Перейти
                                    </Link>
                                </div>
                            </div>
                        )}

                        {projects && projects.length > 0 && projects.map((item, index) => {
                            return <div className={"row " + style.row} onClick={() => clickRow(index)} key={item._id}>
                                <div className={"row__bg " + ((arrRowActive && arrRowActive[index]) ? "active" : "")}></div>
                                <div className={"col " + style.col + " " + style.col__seller}>
                                    <ClampLines text={item.name} lines={2} ellipsis="q223" id="custom" buttons={false} />
                                </div>
                                <div className={"col " + style.col + " " + style.col__count}>
                                    {item.timePlan}
                                </div>
                                <div className={"col " + style.col + " " + style.col__desc}>
                                    <ClampLines text={item.desc ? item.desc.replace(/<\/?[a-zA-Z]+>/gi, '') : "(пусто)"} lines={3} ellipsis="" id="custom" buttons={false} />
                                </div>
                                <div className={"col " + style.col + " " + style.col__count}>
                                    {moment(item.date_start).format("DD.MM.YYYY")}
                                </div>
                                <div className={"col " + style.col + " " + style.col__count}>
                                    {moment(item.date_end).format("DD.MM.YYYY")}
                               </div>
                                <div className={"col " + style.col + " " + style.col__seller}>
                                    <ClampLines text={item.workerName} lines={2} ellipsis="q223" id="custom" buttons={false} />
                                </div>

                                <div className={"col " + style.col}>
                                    <Link to={`/products/${item._id}`} className="btn btn__table">
                                        Перейти
                                    </Link>
                                    {/* <button onClick={() => clickDel(item._id, "Удалить товар?")} className="btn btn__table btn__error">
                                        Удалить
                                    </button> */}
                                </div>
                            </div>
                        })}

                        {tasks && tasks.length > 0 && tasks.map((item, index) => {
                            return <div className={"row " + style.row} onClick={() => clickRow(index)} key={item._id}>
                                <div className={"row__bg " + ((arrRowActive && arrRowActive[index]) ? "active" : "")}></div>
                                <div className={"col " + style.col}>{item.name}</div>
                                <div className={"col " + style.col+" " + style.col__seller}>{item.projectName}</div>
                                <div className={"col " + style.col} style={{ background: statusOrderColor[item.status] }}>{item.status}</div>
                                <div className={"col " + style.col}>
                                {moment(item.date_start).format("DD.MM.YYYY")}
                                </div>
                                <div className={"col " + style.col}>
                                {moment(item.date_PlanEnd).format("DD.MM.YYYY")}
                                </div>
                                <div className={"col " + style.col}>{item.timePlan}</div>
                                <div className={"col " + style.col+" " + style.col__seller}>{item.workerName}</div>
                                <div className={"col " + style.col}>
                                    <Link to={`/tasks/${item._id}`} className="btn btn__table">
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