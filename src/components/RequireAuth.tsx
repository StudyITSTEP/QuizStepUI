import {useAppSelector} from "../app/hooks.ts";
import {selectIsAuth} from "../features/userSlice.ts";
import {Navigate, Outlet, useLocation} from "react-router";

export function RequireAuth() {
    const isLoggedIn = useAppSelector(selectIsAuth);
    const location = useLocation();
    console.log(isLoggedIn);
    return (
        isLoggedIn ?
            <Outlet/> : <Navigate to="/login" state={{from: location}} replace/>
    )
}