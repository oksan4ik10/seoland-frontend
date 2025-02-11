/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom";

import style from "./ProductForm.module.css"

import urlFileImg from "../../assets/images/default-create.png"
import urlIconGeneral from "../../assets/images/genetalIcon.svg"
import urlIconPhoto from "../../assets/images/photoIcon.svg"
import urlIconDesc from "../../assets/images/descIcon.svg"
import urlIconProduct from "../../assets/images/productIcon.svg"
import urlFileShowImg from "../../assets/images/default-show.png"
import { IAttrSize, IProduct } from "../../models/type";

import { davDamerAPI } from "../../store/api/DavdamerAPI";
import Filter from "../Filter/Filter";

import ErrorPages from "../../pages/Error/ErrorPages";
import SelectMultiple from "../SelectMultiple/SelectMultiple";

// import SelectMultiple from "../SelectMultiple/SelectMultiple";


interface IProps {
    edit: boolean,
    data?: IProduct
    id?: string | null,
    refBtn: any,
    funcRequest?: any,
    sendFormFilters: boolean
}



function ProductForm(props: IProps) {
    const { edit, data, refBtn, funcRequest, sendFormFilters, id } = props;

    // const [sendFormFilters, setSendFormFilters] = useState(true);

    const inputFiles = useRef<HTMLInputElement>(null);

    const [filesInfo, setFilesInfo] = useState<any[]>([]);

    const [uploadFiles, setUploadFiles] = useState<string[]>([]);
    const [errorFile, setErrorFile] = useState("");



    const { register, getValues, handleSubmit, formState: { errors } } = useForm<any>({
        defaultValues: {
            title: (data && data.title) ? data.title : edit ? "" : "Не заполнено",
            price: (data && data.price) ? data.price.old_price ? data.price.old_price : data.price.incl_tax : edit ? "" : "Не заполнено",
            old_price: (data && data.price.old_price) ? data.price.incl_tax : "",
            location: (data && data.location) ? data.location : "",
            num_in_stock: (data && data.price.num_in_stock) ? data.price.num_in_stock : edit ? "" : 0,
            multi_size: false
        }
    })




    const { data: attrValues, error: errorAttrValues, isLoading: isAttrValues } = davDamerAPI.useGetEnumsAttrQuery()
    const dataArea: any = {
        location: data && data.location ? data.location : "Не заполнено",
        categories: data ? data.sub_categories[0].full_name.toLocaleString() : "",
        categoryChildren: data?.sub_categories[0].child ? data.sub_categories[0].child.name : "",
        seller: (data && data.seller.name) ? data.seller.name : edit ? "" : "Продавец не выбран",
        price: (data?.price.incl_tax) ? data?.price.old_price ? data.price.old_price + " ₽" : data.price.incl_tax + " ₽" : "0,00 ₽",
        old_price: (data?.price.old_price) ? data.price.incl_tax + " ₽" : "0,00 ₽",
        desc: (data?.description) ? data.description : edit ? "" : "Не заполнено",
        sex: (data?.sex && attrValues) ? attrValues["sex"].find((item) => item.value === data.sex)?.label : edit ? "" : "Не заполнено",
        color: (data?.attributes && attrValues) ? attrValues["color"].find((item) => item.value === data.attributes.find((item) => item.code === "color")?.value)?.label : edit ? "" : "Не заполнено",
        size: (data?.attributes && attrValues) ? attrValues["size"].find((item) => item.value === data.attributes.find((item) => item.code === "size")?.value)?.label : edit ? "" : "Не заполнено",
        material: (data?.material && attrValues) ? attrValues["material"].find((item) => item.value === data.material)?.label : edit ? "" : "Не заполнено"
    }


    const { data: categories, error: errorCategory, isLoading: isCategory } = davDamerAPI.useFetchGetCategoryQuery();
    const [idCategoryName, setIdCategoryName] = useState(data?.sub_categories[0].full_name);
    const [titleCategoryChildren, setTitleCategoryChildren] = useState(dataArea.categoryChildren)

    const filterCategory = {
        title: dataArea.categories ? dataArea.categories : "Выберите категорию",
        nameFilter: "categories",
        categories: categories ? categories.map((item) => item.full_name) : [],
    }
    const filterCategoryChildren = {
        title: titleCategoryChildren ? titleCategoryChildren : "Выберите подкатегорию",
        nameFilter: "categoryChildren",
        categoryChildren: (idCategoryName && categories) ? categories.filter((item) => item.full_name === idCategoryName)[0].children.map((item) => item.name) : []
    }


    const { data: sellers, error: errorSellers, isLoading: isSellers } = davDamerAPI.useFetchAllSellersQuery({ ordering: "" });
    const filterSellers = {
        title: dataArea.seller ? dataArea.seller : "Выберите продавца",
        nameFilter: "seller",
        seller: sellers ? sellers.map((item) => ({ name: item.name, id: item.id })) : [],
        id: true
    }





    const filterSex = {
        title: dataArea.sex ? dataArea.sex : "Выберите пол",
        nameFilter: "sex",
        sex: attrValues ? attrValues["sex"].map((item) => ({ name: item.label, id: item.value })) : [],
        id: true
    }
    const filterMaterial = {
        title: dataArea.material ? dataArea.material : "Выберите материал",
        nameFilter: "material",
        material: attrValues ? attrValues["material"].map((item) => ({ name: item.label, id: item.value })) : [],
        id: true
    }
    const filterColor = {
        title: dataArea.color ? dataArea.color : "Выберите цвет",
        nameFilter: "attrColor",
        attrColor: attrValues ? attrValues["color"].map((item) => ({ name: item.label, id: item.value })) : [],

        id: true
    }



    const filterSize = {
        title: dataArea.size ? dataArea.size : "Выберите размер",
        nameFilter: "attrSize",
        attrSize: attrValues ? attrValues["size"].map((item) => ({ name: item.label, id: item.value })) : [],
        id: true
    }




    const [valuesFilter, setValuesFilter] = useState<any>({
        categories: dataArea.categories ? dataArea.categories : "",
        categoryChildren: dataArea.categoryChildren ? dataArea.categoryChildren : "",
        seller: data?.seller.id ? data.seller.id : "",
        sex: data?.sex ? data?.sex : "",

        material: data?.material ? data?.material : "",
        attrColor: data?.attributes.find((item) => (item.code === "color")) ? data?.attributes.find((item) => (item.code === "color"))?.value : "",
        attrSize: data?.attributes.find((item) => (item.code === "size")) ? data?.attributes.find((item) => (item.code === "size"))?.value : ""

    })


    const [keyCategoryChildren, setKeyCategoryChildren] = useState(0);
    const setParamsFilter = (key: string, value: string) => {
        const obj: any = Object.assign({}, valuesFilter)

        obj[key] = value ? value : dataArea[key];
        if (key === "categories") {

            obj.categoryChildren = value ? "" : dataArea.categoryChildren;
            setIdCategoryName(value ? value : dataArea.categories);
            setKeyCategoryChildren(Math.random())
            setTitleCategoryChildren(value ? "Выберите подкатегорию" : dataArea.categoryChildren)
        }
        if (key === "categoryChildren" && !value) {
            setKeyCategoryChildren(Math.random())
            obj.categoryChildren = obj.category === dataArea.categories ? dataArea.categoryChildren : ""
            setTitleCategoryChildren(!obj.categoryChildren ? "Выберите подкатегорию" : dataArea.categoryChildren)
        }
        setValuesFilter(obj)
    }


    const [checkMultipleSize, setCheckMultipleSize] = useState(false);
    const filterSizes = {
        title: dataArea.size ? dataArea.size : "Выберите размеры",
        nameFilter: "attrSize",
        attrSize: attrValues ? attrValues["size"].map((item) => ({ name: item.label, id: item.value, check: false })) : [],

    }

    const checkMultiple = () => {
        setCheckMultipleSize(!checkMultipleSize)
        setAttrSize([]);
        setParamsFilter("attrSize", "")

    }

    const [attrSize, setAttrSize] = useState<string[]>([])
    const saveSize = (data: IAttrSize[]) => {
        const arr = data.filter((item) => item.check).map((item) => item.id)
        setAttrSize(arr);

    }


    const [desc, setDesc] = useState((data && data.description) ? data.description.replace(/<\/?[a-zA-Z]+>/gi, '') : "");
    const changeDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDesc(e.target.value);
    }



    const addFakeFiles = () => {
        setIsErrorPhoto(false);
        if (!edit) return;
        if (inputFiles.current) inputFiles.current.click();
    }
    const filesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

        const target = e.target as HTMLInputElement;
        const files: FileList | null = (target.files);
        if (files) {
            if ((uploadFiles.length + files.length) > 4) {
                setErrorFile("Выберите не более 4х файлов");
                return
            }
            setErrorFile("");
            setFilesInfo([...filesInfo, ...files])
            const fileBase64Promises = Array.from(files).map((file) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                return new Promise((resolve, reject) => {
                    reader.onload = () => {
                        resolve(reader.result);
                    };
                    reader.onerror = () => {
                        reject(reader.error);
                    };
                });
            });
            const fileBase64Arr: any[] = await Promise.all(fileBase64Promises);
            setUploadFiles([...uploadFiles, ...fileBase64Arr])

        }

    }

    const inputFile1 = useRef<HTMLInputElement>(null);
    const inputFile2 = useRef<HTMLInputElement>(null);
    const inputFile3 = useRef<HTMLInputElement>(null);
    const inputFile4 = useRef<HTMLInputElement>(null);
    const arrRefInput = [inputFile1, inputFile2, inputFile3, inputFile4]
    const addFakeFile = (index: number) => {

        if (!edit) return;
        const ref = arrRefInput[index]

        if (ref.current) ref.current.click();

    }


    const [arrIdImg, setArrIdImg] = useState<Set<number>>(new Set())
    const fileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {

        const target = e.target as HTMLInputElement;
        const files = (target.files) ? target.files[0] : "";
        const idImg = target.getAttribute("data-id");
        if (files) {
            if (!/\.(jpe?g|png|gif)$/i.test(files.name)) {
                setErrorFile("Неверный формат");
                return
            }
            setErrorFile("");
            setFilesInfo(filesInfo.map((item, i) => {
                if (i === index) return files as any
                return item
            }))
            const reader = new FileReader();
            reader.addEventListener("load", function () {

                setUploadFiles(uploadFiles.map((item, i) => {
                    if (i === index) return this.result as any
                    return item
                }))
            });

            reader.readAsDataURL(files);
        }
        if (idImg) {
            setArrIdImg(arrIdImg.add(+idImg))
        }

    }
    const closeFile = (e: React.MouseEvent<HTMLSpanElement>, index: number) => {
        e.stopPropagation()
        const target = e.target as HTMLElement;
        const idImg = target.getAttribute("data-id");
        if (idImg) {
            setArrIdImg(arrIdImg.add(+idImg))
        }

        setUploadFiles(uploadFiles.filter((_, i) => i !== index))
        setFilesInfo(filesInfo.filter((_, i) => i !== index))

    }



    useEffect(() => {
        if (data && data.images.length !== 0) {
            setUploadFiles(data.images.map((item) => item.original))
            setFilesInfo(data.images.map(() => undefined))
        }
    }, [data])



    const [isErrorPhoto, setIsErrorPhoto] = useState(false);
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<any> = async (dataParam) => {



        if (errorFile) return

        let filterValues = true;
        const arrAttr: any[] = [];
        let valueCategory = valuesFilter.categories;
        for (const key in valuesFilter) {
            if (key === "attrSize" && attrSize.length !== 0) continue


            if ((key === "categoryChildren") && filterCategoryChildren.categoryChildren.length === 0) continue
            if (!valuesFilter[key as any]) {
                filterValues = false;
                break
            }
            if (key === "categoryChildren") valueCategory = `${valuesFilter.categories} > ${valuesFilter.categoryChildren}`

            if (key.slice(0, 4) === "attr") {
                const attr = { code: key.slice(4).toLocaleLowerCase(), value: valuesFilter[key] }
                arrAttr.push(attr)
            }

        }

        // 


        if (!filterValues || (!valuesFilter.attrSize && attrSize.length === 0)) return
        if (((data?.images.length === 0) && filesInfo.length === 0) || ((data?.images.length === arrIdImg.size) && filesInfo.length === 0) || (!data && filesInfo.length === 0)) {
            setIsErrorPhoto(true);
            return
        }



        const formData = new FormData();

        if (filesInfo) {
            filesInfo.filter((i) => i).forEach((item) => {
                formData.append("uploaded_images", item);
            })
        }



        if (desc) formData.append("description", desc);

        for (const key in dataParam) {
            if (dataParam[key]) formData.append(key, dataParam[key] as any)
        }
        if (formData.get("old_price")) {
            const price = formData.get("price");
            const newPrice = formData.get("old_price");
            formData.set("old_price", price as any)
            formData.set("price", newPrice as any)
        }


        if (attrSize.length !== 0) arrAttr.push({ code: "size", value: attrSize })

        formData.append("attributes", JSON.stringify(arrAttr))
        formData.append("categories", [valueCategory] as any);
        formData.append("sex", valuesFilter.sex);
        formData.append("material", valuesFilter.material);

        formData.append("new_seller_id", valuesFilter.seller as any)


        if (!id) {

            try {
                if (funcRequest) {
                    const data = await funcRequest({ id: valuesFilter.seller, body: formData });
                    if (data.error) return
                    navigate(`/products`)
                }
            }
            catch {
                navigate(`/404`)

            }
        } else {
            const arrDeleImg = Array.from(arrIdImg);
            try {
                if (funcRequest && data) {
                    formData.append("deleted_images", JSON.stringify(arrDeleImg));

                    const dataRequest = await funcRequest({ id: data.id, body: formData });
                    if (dataRequest.error) return
                    navigate(`/products`)
                }
            } catch {
                navigate(`/404`)

            }

        }
    }






    if (errorCategory || errorSellers || errorAttrValues) return <ErrorPages></ErrorPages>

    if (isCategory || isSellers || isAttrValues) return <h2>Загрузка данных</h2>

    return (
        <>
            <form className={'form ' + (edit && (!data || (data && data.children.length !== 0)) ? style.formEdit : "") + " " + style.form + " " + (!edit ? "show" : "")} encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                <div className={"form__head " + style.form__head}>
                    {data && !edit && <div className="form__file">
                        <div className="form__addFile">
                            <img src={(data.images.length > 0 && data.images[0].original) ? data.images[0].original : urlFileShowImg} alt="addFile" />

                        </div>

                    </div>
                    }
                    <label className="form__name form__label">
                        {edit && <span>Название</span>}
                        <input placeholder="Заполните название" type="text"  {...register("title", { validate: (value) => ((value.length > 2) && (value.length < 30)), disabled: edit ? false : true })} />
                        {errors.title && <span className="form__error">Длина строки от 2 до 30 символов</span>}
                    </label>
                </div>
                <div className={style.form__general}>
                    <h3 className="form__title"><img src={urlIconGeneral} alt="desc" />Общее</h3>
                    <div className={"form__label" + " " + (valuesFilter.categories ? "value" : "")}>
                        <span>Категория</span>
                        {((!edit && data) || (edit && data?.parent)) && <span className={style.spanName}>{dataArea.categories}</span>}
                        {edit && !data?.parent && <Filter data={filterCategory as any} setParamsFilter={setParamsFilter}></Filter>}

                        {sendFormFilters && edit && !valuesFilter.categories && <span className="form__error">Выберите категорию</span>}
                    </div>
                    {filterCategoryChildren.categoryChildren.length > 0 && <div key={keyCategoryChildren} className={"form__label" + " " + (valuesFilter.categoryChildren ? "value" : "")}>
                        <span>Подкатегория</span>
                        {((!edit && data) || (edit && data?.parent)) && <span className={style.spanName}>{dataArea.categoryChildren ? dataArea.categoryChildren : "Не заполнено"}</span>}
                        {edit && !data?.parent && <Filter data={filterCategoryChildren as any} setParamsFilter={setParamsFilter}></Filter>}

                        {sendFormFilters && edit && !valuesFilter.categoryChildren && <span className="form__error">Выберите подкатегорию</span>}
                    </div>}

                    <div className={"form__label" + " " + (valuesFilter.seller ? "value" : "")}>
                        <span>Продавец</span>
                        {!edit && data && <span className={style.spanName}>{dataArea.seller}</span>}
                        {edit && !data?.parent && <Filter data={filterSellers as any} setParamsFilter={setParamsFilter}></Filter>}

                        {edit && sendFormFilters && !valuesFilter.seller && <span className="form__error">Выберите продавца</span>}
                    </div>
                    <div className={"form__label" + " " + (valuesFilter.material ? "value" : "")}>
                        <span>Материал</span>
                        {((!edit && data) || (edit && data?.parent)) && <span className={style.spanName}>{dataArea.material}</span>}
                        {edit && !data?.parent && <Filter data={filterMaterial as any} setParamsFilter={setParamsFilter}></Filter>}

                        {edit && sendFormFilters && !valuesFilter.material && <span className="form__error">Выберите материал</span>}
                    </div>
                    <div className={"form__label" + " " + (valuesFilter.sex ? "value" : "")}>
                        <span>Пол</span>
                        {((!edit && data) || (edit && data?.parent)) && <span className={style.spanName}>{dataArea.sex}</span>}
                        {edit && !data?.parent && <Filter data={filterSex as any} setParamsFilter={setParamsFilter}></Filter>}

                        {edit && sendFormFilters && !valuesFilter.sex && <span className="form__error">Выберите материал</span>}
                    </div>


                    <div className={"form__label " + style.form__price}>
                        <span>Стоимость</span>
                        {!edit && data && <span className={style.spanName + " "}>{dataArea.price}</span>}
                        {edit && <input placeholder="0.00 ₽" type="number"  {...register("price", {
                            validate: (value) => ((value > 9) && ((value <= 500000))), disabled: edit ? false : true
                        }
                        )} />}
                        {errors.price && <span className="form__error">Введите стоимость от 10 ₽ до 500 000 ₽ </span>}
                    </div>
                    {(edit || (data?.price.old_price)) && <div className={"form__label " + style.form__price}>
                        <span>Акционная цена</span>
                        {!edit && data && <span className={style.spanName + " "}>{dataArea.old_price}</span>}
                        {edit && <input placeholder="0.00 ₽" type="number"  {...register("old_price", {

                            validate: { count: (value) => (!value || (value > 9) && ((value <= 500000))), checkPrice: (value) => (value < +getValues("price")) }, disabled: edit ? false : true
                        }
                        )} />}

                        {errors.old_price && errors.old_price.type === "count" && <span className="form__error">Акционная цена должна быть от 10 ₽ до 500 000 ₽ </span>}
                        {errors.old_price && errors.old_price.type === "checkPrice" && <span className="form__error">Акционная цена должна быть ниже стоимости товара </span>}
                    </div>}
                    <label className="form__label">
                        <span>Расположение</span>
                        {!edit && data && <span className={style.spanName + " "}>{dataArea.location}</span>}
                        {edit && <input placeholder="Заполните расположение товара" type="text"  {...register("location", { validate: (value) => ((value.length > 4) && (value.length < 150)), disabled: edit ? false : true })} />}
                        {errors.location && <span className="form__error">Длина строки от 5 до 150 символов</span>}
                    </label>

                </div>
                {(!data || data.children.length === 0) && <div className={style.form__attr}>
                    <h3 className="form__title"><img src={urlIconGeneral} alt="desc" />Характеристики</h3>
                    {(!data && edit) && <label className={"form__label label__check"}>
                        <input type="checkbox" {...register("multi_size")} onChange={checkMultiple} />
                        <span>Товар с несколькими вариантами</span>
                    </label>}

                    <div className={"form__label" + " " + (valuesFilter.attrColor ? "value" : "")}>
                        <span>Цвет</span>
                        {!edit && data && <span className={style.spanName}>{dataArea.color}</span>}
                        {edit && <Filter data={filterColor as any} setParamsFilter={setParamsFilter}></Filter>}

                        {edit && sendFormFilters && !valuesFilter.attrColor && <span className="form__error">Выберите цвет</span>}
                    </div>
                    <div className={"form__label" + " " + ((valuesFilter.attrSize || attrSize.length !== 0) ? "value" : "")}>
                        <span>Размеры</span>
                        {!edit && data && <span className={style.spanName}>{dataArea.size}</span>}
                        {edit && !checkMultipleSize && <Filter data={filterSize as any} setParamsFilter={setParamsFilter}></Filter>}
                        {edit && checkMultipleSize && <SelectMultiple data={filterSizes} setParamsFilter={saveSize}></SelectMultiple>}
                        {edit && sendFormFilters && (((!valuesFilter.attrSize) && !checkMultipleSize) || (attrSize.length === 0 && checkMultipleSize)) && <span className="form__error">Выберите размер</span>}

                    </div>
                    {(((data && edit) || (data && !edit && data.price.num_in_stock)) || !data) && <label className="form__label">
                        <span>В наличии, шт.</span>
                        <input placeholder="Заполните количество товара" type="number"  {...register("num_in_stock", { validate: (value) => value > 0, disabled: edit ? false : true })} />
                        {errors.num_in_stock && <span className="form__error">Число должно быть больше 0</span>}
                    </label>}
                </div>}


                {(!data || data.children.length === 0) && <div className={style.form__files}>
                    <h3 className="form__title"> <img src={urlIconPhoto} alt="photoIcon" />Фото товара</h3>
                    <div className={style.form__addFile}>
                        <div className={"form__file " + style.form__fileImg}>
                            {uploadFiles.map((item, index) => {
                                return <div key={index} onClick={() => addFakeFile(index)} className={"form__addFile " + style.file}>
                                    <div className={style.wrapImg}>
                                        <img src={item} alt="" />
                                    </div>

                                    {edit && <span className="file__close" data-id={data?.images[index] ? data.images[index].id : ""} onClick={(e) => closeFile(e, index)}>X</span>}
                                    <input accept="image/png, image/jpeg" type="file" id="file" data-id={data?.images[index] ? data.images[index].id : ""} ref={arrRefInput[index]} onChange={(e) => fileChange(e, index)} />
                                </div>
                            })}
                            {(uploadFiles.length < 4) && edit &&
                                <div onClick={addFakeFiles} className={"form__addFile " + style.file}>
                                    <div className={style.wrapImg}>
                                        <img src={urlFileImg} alt="addFile" /></div>
                                    {errorFile && <span className="form__error">{errorFile}</span>}
                                    <input accept="image/png, image/jpeg" type="file" multiple id="files" ref={inputFiles} onChange={filesChange} />
                                </div>



                            }
                        </div>
                        <input type="submit" value="Отправить" className="form__submit" ref={refBtn} />

                    </div>
                    {edit && sendFormFilters && isErrorPhoto && <span className="form__error">Добавьте фото товара</span>}

                </div>}

                <div className={"form__desc " + style.form__desc + " " + ((data && data.children.length !== 0) ? style.desc__full : "")}>
                    <h3 className="form__title"> <img src={urlIconDesc} alt="desc" />Описание</h3>
                    <div className="form__textarea">
                        <label className="form__label">
                            <span>Общее описание товара</span>
                            {edit && <textarea name="description" onChange={changeDesc} id="" cols={30} rows={10} value={desc}></textarea>}
                            {!edit && <textarea disabled name="description" value={desc ? desc : "Не заполнено"} onChange={changeDesc} id="" cols={30} rows={10}></textarea>}
                        </label>
                    </div>

                </div>

                {data && data.children.length !== 0 && !edit && <div className={style.form__products}>
                    <div className={style.form__titleProduct}>
                        <h3 className="form__title"> <img src={urlIconProduct} alt="desc" />Варианты товара</h3>
                        <Link to={`/products/add-variants/${id}`} className={"btn btn__active btn__head " + style.productBtn}>Добавить вариант</Link>
                    </div>

                    <div className={style.form__variants}>
                        {(!data.items || data.items.length === 0) && <p className="form__label"><span>Нет вариантов</span></p>}
                        {(data.items && data.items.length !== 0) && data?.items.map((item) => <Link to={`/products/edit-variants/${id}/${item.color.value}`} className={style.item} key={item.id}>
                            <div className={style.item_img}>
                                <img src={item.images[0] ? item.images[0].original : ""} alt={item.id + ""} />
                            </div>
                            <p className={style.item_title}>{`Цвет: ${item.color.label.toLowerCase()}`}</p>
                        </Link>)}

                    </div>

                </div>}

            </form>
        </>
    )
}

export default ProductForm