import { PropsWithChildren } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

import { useAppSelector } from '../store/store';



const RequireAuth = ({ children }: PropsWithChildren) => {
    const location = useLocation();
    const token: string = useAppSelector((store) => store.userReducer).access_token;

    const isAdmin = useAppSelector((store) => store.userReducer).user.is_admin;
    if (!token) {
        return <Navigate to='/login' state={{ from: location }} />
    }
    if ((!isAdmin) && ((location.pathname.slice(0, 10) === "/davdamers") || (location.pathname.slice(0, 12) === "/directories"))) {
        return <Navigate to='/404' state={{ from: location }} />
    }

    return children;

}

export { RequireAuth };