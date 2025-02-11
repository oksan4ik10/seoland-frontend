/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"

import urlArrow from "../../assets/images/filter-arrow.svg"
import urlSearch from "../../assets/images/search.svg"
import { IDataFilter } from "../TablePage/TablePage"

import style from "./SelectMultiple.module.css"





interface IProps {
    setParamsFilter: (data: any) => void,
    data: IDataFilter,
}

function SelectMultiple(props: IProps) {

    const { setParamsFilter, data } = props;

    const [dataOld, setDataOld] = useState<any[]>([]);
    const [titleValue, setTitleValue] = useState("");



    useEffect(() => {
        const arr = data[(data["nameFilter"]) as any];
        let countCheck = 0;

        const newArr: any[] = []
        arr.forEach((item: any) => {
            const el = Object.assign({}, item)
            newArr.push(el)
            if (el.check) countCheck++;
        })

        setDataOld(newArr);
        setTitleValue(countCheck + "")
    }, [])


    const [isActive, setActive] = useState(false)
    const [isSearchImg, setSearchImg] = useState(true);


    const [dataItem, setDataItem] = useState([...data[(data["nameFilter"]) as any]]);

    const [searchValue, setSearchValue] = useState("");

    const [isCancel, setIsCancel] = useState(false);

    const [isSearch, setIsSearch] = useState(false);
    const inputSearch = (e: React.MouseEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const value = target.value;
        setIsSearch(true);
        setSearchValue(value)
        if (value.length === 0) {
            setSearchImg(true);
            setDataItem(dataOld);
            return
        }
        setSearchImg(false);
        const result = dataOld.filter((item: any) => item.name.toString().toLowerCase().indexOf(value.toLowerCase()) !== -1)
        setDataItem(result)

    }
    const clickListItem = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        const labelElem = target.closest("li");
        if (!labelElem) return;

        const id = labelElem.getAttribute("data-id");

        const arr: any[] = []
        let countCheck = 0;
        dataItem.forEach((item: any) => {
            const obj = Object.assign({}, item);
            if (obj.id === id) obj.check = !obj.check
            arr.push(obj)
            if (obj.check) countCheck++;
        })
        setTitleValue(countCheck + "");
        setDataItem(arr);
        setParamsFilter(arr);
        setIsCancel(true);


    }
    const clickCancel = () => {
        setDataItem(dataOld);
        setIsCancel(false);
        setParamsFilter(dataOld);
        setActive(!isActive)
        let countCheck = 0;
        dataOld.forEach((item) => {
            if (item.check) countCheck++;
        })
        setTitleValue(countCheck + "");
    }
    const clickHeadFilter = () => {

        setActive(!isActive)
        setSearchValue("")
    }
    return (
        <>
            <div className={"filter " + (((isActive)) ? "active" : "") + " "} >
                <div className="filter__head" onClick={clickHeadFilter}> <span>{titleValue ? `Выбрано: ${titleValue}` : data["title"]}</span> <img src={urlArrow} alt="arrow" /> </div>
                <ul className="filter__content scroll__elem">
                    {(dataItem.length > 5 || isSearch) && <li className="filter__search">
                        <label htmlFor="search" className={isSearchImg ? "" : "disable"}>
                            <input name="search" type="search" placeholder="Поиск" onInput={inputSearch} value={searchValue} />
                            <img src={urlSearch} alt="search" className="searchImg" />

                        </label>
                    </li>}
                    {isCancel && <li className={"cancel " + style.cancel} onClick={clickCancel}>Сбросить</li>}

                    {dataItem.map((item: any) => {
                        return <li onClick={clickListItem} className={style.itemList + " " + (item.check ? style.check : "")} key={item.id} data-value={item.toString()} data-id={item.id}><span className={style.filter__square}></span><span>{item.name.toString()}</span></li>
                    })}




                </ul>
            </div>
        </>
    )
}

export default SelectMultiple