import {Header} from "antd/es/layout/layout";
import {Button, Flex, Menu, type MenuProps} from "antd";
import {Link, useNavigate} from "react-router";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {logout, selectUser} from "../features/userSlice.ts";

type MenuItem = Required<MenuProps>['items'][number];

type CustomMenuItems = MenuItem & {
    authOnly?: bool
    role?: string
}

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
        },

    ];

    items = items.filter(item => user.isAuthenticated && item.authOnly)

    return (
        <>
            <Header>
                <Flex align="center" justify="space-between" vertical={false}>
                    <Menu style={{minWidth: "fit-content"}} mode="horizontal" defaultSelectedKeys={["home"]} theme={"dark"} items={items}/>
                    {user.isAuthenticated && (
                        <Button type="default" onClick={() => onLogout()}>Logout</Button>)}
                </Flex>
            </Header>
        </>
    )
}