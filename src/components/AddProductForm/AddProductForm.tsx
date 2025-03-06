/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom";

import style from "./AddProductForm.module.css"

import urlFileImg from "../../assets/images/default-create.png"
import urlIconGeneral from "../../assets/images/genetalIcon.svg"
import urlIconPhoto from "../../assets/images/photoIcon.svg"

import { IProduct } from "../../models/type";

import { api } from "../../store/api/api";
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

interface IAttrColor {
    name: string;
    id: string;
}
interface IAttrSize {
    name: string;
    id: string;
    check: boolean;
}

function AddProductForm(props: IProps) {
    const { edit, data, refBtn, funcRequest, sendFormFilters, id } = props;


    // const [sendFormFilters, setSendFormFilters] = useState(true);

    const inputFiles = useRef<HTMLInputElement>(null);

    const [filesInfo, setFilesInfo] = useState<any[]>([]);

    const [uploadFiles, setUploadFiles] = useState<string[]>([]);
    const [errorFile, setErrorFile] = useState("");



    const { handleSubmit, register, formState: { errors } } = useForm<any>({
        defaultValues: {
            title: (data && data.title) ? data.title : edit ? "" : "Не заполнено",

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

    const colors = data?.items ? data.items.map((item) => item.color.value) : [];

    const filterColor = {
        title: dataArea.color ? dataArea.color : "Выберите цвет",
        nameFilter: "attrColor",
        attrColor: attrValues ? attrValues["color"].reduce((res: IAttrColor[], item) => {

            if (colors?.indexOf(item.value) !== -1) return res;
            const color = { name: item.label, id: item.value }
            res.push(color);

            return res
        }, []) : [],

        id: true
    }

    const filterSize = {
        title: dataArea.size ? dataArea.size : "Выберите размер",
        nameFilter: "attrSize",
        attrSize: attrValues ? attrValues["size"].map((item) => ({ name: item.label, id: item.value, check: false })) : [],

    }

    const [attrSize, setAttrSize] = useState<string[]>([])
    const saveSize = (data: IAttrSize[]) => {
        const arr = data.filter((item) => item.check).map((item) => item.id)
        setAttrSize(arr);

    }



    const [valuesFilter, setValuesFilter] = useState<any>({

        attrColor: "",

    })


    const setParamsFilter = (key: string, value: string) => {
        const obj: any = Object.assign({}, valuesFilter)

        obj[key] = value ? value : dataArea[key];
        setValuesFilter(obj)
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




    const [isErrorPhoto, setIsErrorPhoto] = useState(false);
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<any> = async (dataParam) => {
        if (errorFile) return
        if (!data) return

        let filterValues = true;
        for (const key in valuesFilter) {

            if (!valuesFilter[key as any]) {
                filterValues = false;
                break
            }
        }

        // 


        if (!filterValues || attrSize.length === 0) return

        if (filesInfo.length === 0) {
            setIsErrorPhoto(true);
            return
        }



        const formData = new FormData();



        if (filesInfo) {
            filesInfo.filter((i) => i).forEach((item) => {
                formData.append("images", item);
            })
        }
        for (const key in dataParam) {
            if (dataParam[key]) formData.append(key, dataParam[key] as any)
        }




        formData.append("color", valuesFilter.attrColor);
        formData.append("sizes", JSON.stringify(attrSize));

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

    if (errorAttrValues) return <ErrorPages></ErrorPages>

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



                    <div className={"form__label" + " " + (valuesFilter.attrColor ? "value" : "")}>
                        <span>Цвет</span>
                        {edit && <Filter data={filterColor as any} setParamsFilter={setParamsFilter}></Filter>}

                        {edit && sendFormFilters && !valuesFilter.attrColor && <span className="form__error">Выберите цвет</span>}
                    </div>
                    <div className={"form__label" + " " + (attrSize.length !== 0 ? "value" : "")}>
                        <span>Размеры</span>

                        <SelectMultiple data={filterSize} setParamsFilter={saveSize}></SelectMultiple>

                        {edit && sendFormFilters && attrSize.length === 0 && <span className="form__error">Выберите размер</span>}
                    </div>
                    <label className="form__label">
                        <span>В наличии, шт.</span>
                        <input placeholder="Заполните количество товара" type="number"  {...register("num_in_stock", { validate: (value) => value > 0, disabled: edit ? false : true })} />
                        {errors.num_in_stock && <span className="form__error">Число должно быть больше 0</span>}
                    </label>
                </div>

                <div className={style.form__files}>
                    <h3 className="form__title"> <img src={urlIconPhoto} alt="photoIcon" />Фото варианта товара</h3>
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
                    {sendFormFilters && isErrorPhoto && <span className="form__error">Добавьте фото товара</span>}

                </div>

            </form>
        </>
    )
}

export default AddProductForm