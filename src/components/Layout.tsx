import {Outlet} from "react-router";
import {Layout as AntdLayout} from "antd";
import {CustomHeader} from "./CustomHeader.tsx";

export const Layout = () => {
    return (
        <>
            <AntdLayout>
                <CustomHeader />
                <Outlet/>
            </AntdLayout>
        </>
    )
}