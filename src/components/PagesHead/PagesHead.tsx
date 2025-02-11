import { Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { setToken } from "../../store/reducer/userReducer";

import "./PagesHead.css"
import urlPhoto from "../../assets/images/test-davdamer.png";


interface IProps {
    title: string;
}
function Pages(props: IProps) {

    const { title } = props;

    const infoUser = useAppSelector((store) => store.userReducer).user;


    const dispatch = useAppDispatch();
    const clickLogOut = () => {
        dispatch(setToken(""))
        localStorage.removeItem("token")
        return <Navigate to='/login' state={{ from: location }} />
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
                        <div className="page__img">
                            <img src={infoUser.image ? infoUser.image : urlPhoto} alt="photo" />
                        </div>
                        <button onClick={clickLogOut} className="btn__page btn__table">Выход</button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Pages