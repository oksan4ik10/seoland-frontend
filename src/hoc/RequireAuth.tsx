import { PropsWithChildren } from 'react';
import { useLocation, Navigate } from 'react-router-dom';



const RequireAuth = ({ children }: PropsWithChildren) => {
    const location = useLocation();
    const user = localStorage.getItem('user') || '';
    const isAdmin = user ? JSON.parse(user).user.is_admin : false;
    
    
    
    if (!user) {
        return <Navigate to='/login' state={{ from: location }} />
    }
    if(!isAdmin && location.pathname.slice(0, 12) !== "/worker-task" && location.pathname !== "/login") return <Navigate to='/worker-task' />

    if(isAdmin && location.pathname.slice(0, 12) === "/worker-task") return <Navigate to='/' />
    return children;

}

export { RequireAuth };