import {Header} from "antd/es/layout/layout";
import {Button, Flex, Menu} from "antd";
import {Link, useNavigate} from "react-router";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {logout, selectUser} from "../features/userSlice.ts";
import type {CustomMenuItems} from "../types/CustomMenuItem.ts";


export function CustomHeader() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);

    const onLogout = () => {
        dispatch(logout());
        navigate("/login");
    }


    let items: CustomMenuItems[] = [
        {
            key: "home",
            label: <Link to={"/home"}>Home</Link>,
            authOnly: true
        },{
            key: "laboratory",
            label: <Link to={"/laboratory"}>Laboratory</Link>,
            authOnly: true
        },

    ];

    items = items.filter(item => user.isAuthenticated && item.authOnly)

    return (
        <>
            <Header>
                <Flex align="center" justify="space-between" vertical={false}>
                    <Menu style={{minWidth: "200px"}} mode="horizontal" defaultSelectedKeys={["home"]} theme={"dark"} items={items}/>
                    {user.isAuthenticated && (
                        <Button type="default" onClick={() => onLogout()}>Logout</Button>)}
                </Flex>
            </Header>
        </>
    )
}