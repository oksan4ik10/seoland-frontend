import { Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { resetUser } from "../../store/reducer/userReducer";

import "./PagesHead.css"


interface IProps {
    title: string;
    isWorker?:boolean
}
function Pages(props: IProps) {

    const { title, isWorker} = props;

    const infoUser = useAppSelector((store) => store.userReducer).user;


    const dispatch = useAppDispatch();
    const clickLogOut = () => {
        dispatch(resetUser())
        localStorage.removeItem("user")
        if(isWorker) {
            setTimeout(()=> {
                window.location.reload()
            }, 200)
        }
        return <Navigate to='/login' />

     
    }
    return (
        <>
            <div className="page">
                <div className="page__head">
                    <h2 className="page__title">{title}</h2>
                    <div className="page__user">
                        <div className="page__name">
                            <span>{infoUser.last_name}</span>
                            <span>{infoUser.name}</span>
                        </div>
                        <button onClick={clickLogOut} className="btn__page btn__table">Выход</button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Pages