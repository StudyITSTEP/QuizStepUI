import {selectRoles} from "../features/userSlice.ts";
import {useAppSelector} from "../app/hooks.ts";
import {useLayoutEffect, useState} from "react";
import {Spin} from "antd";
import {Outlet} from "react-router";
import {ForbiddenPage} from "../pages/ForbiddenPage.tsx";

export function RequireAuthorization({allowedRoles}:{allowedRoles: string[]}) {

    const roles = useAppSelector(selectRoles);
    const [loading, setLoading] = useState(true);
    useLayoutEffect(() => {
        if (roles) {
            setLoading(false);
        }
    }, [roles])
    return (
        <>
            {loading ? <Spin fullscreen/> :
                roles.find(role => allowedRoles.includes(role)) ? <Outlet/> : <ForbiddenPage/>
            }
        </>
    )
}