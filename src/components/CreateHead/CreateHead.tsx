import "./CreateHead.css"

import { Link, useParams, useNavigate } from "react-router-dom";

interface IProps {
    title: string;
    namePage: string;
    nameFunc: string;
    saveFunc?: () => void;
    redirect: boolean;
    cancel?: boolean;
}
function CreateHead(props: IProps) {
    const { id } = useParams();
    const { title, namePage, nameFunc, saveFunc, redirect, cancel } = props;
    const navigate = useNavigate();
    const saveClick = () => {
        if (saveFunc) {
            saveFunc();
        }

        if (redirect) navigate(`/${namePage}`)

    }
    const cancelClick = () => navigate(-1)

    return (
        <>
            <div className="page">
                <div className="page__head page__headCreate">
                    <h2 className="page__title">{title}</h2>
                    <div className="page__btns head__btns">
                        {cancel && <button className="btn__cancel btn__head" onClick={cancelClick}>Отмена</button>}
                        {!cancel && <Link to={`/${namePage}`} className="btn__cancel btn__head">Отмена</Link>}
                        {nameFunc === "show" && <Link to={`/${namePage}/edit/${id}`} className="btn__active btn__head">Редактировать</Link>}
                        {nameFunc === "show" && namePage==="tasks" && <Link to={`/${namePage}/plan/${id}`} className="btn__active btn__head">Планирование</Link>}
                        {nameFunc === "save" && <button className="btn__active btn__head" onClick={saveClick}>Сохранить</button>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateHead