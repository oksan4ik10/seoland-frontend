import { PropsWithChildren } from 'react';
import { useLocation, Navigate } from 'react-router-dom';



const RequireAuth = ({ children }: PropsWithChildren) => {
    const location = useLocation();
    const user = localStorage.getItem('user') || '';

    const isAdmin = user ? JSON.parse(user).is_admin : false;
    if (!user) {
        return <Navigate to='/login' state={{ from: location }} />
    }
    if ((!isAdmin) && ((location.pathname.slice(0, 10) === "/davdamers") || (location.pathname.slice(0, 12) === "/directories"))) {
        return <Navigate to='/404' state={{ from: location }} />
    }

    return children;

}

export { RequireAuth };