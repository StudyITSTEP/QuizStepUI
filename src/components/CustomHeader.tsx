import {Header} from "antd/es/layout/layout";
import {Flex, Menu} from "antd";
import {useNavigate} from "react-router";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {logout, selectUser} from "../features/userSlice.ts";
import MenuItem from "antd/es/menu/MenuItem";


export function CustomHeader() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const onLogout = () => {
        dispatch(logout());
        navigate("/login");
    }

    return (
        <>
            <Header>
                <Menu theme="dark" mode="horizontal" >
                    <Flex vertical={false}  justify="space-between">
                    {user.isAuthenticated &&
                        <>
                            <MenuItem key="home">
                                Home
                            </MenuItem>

                            <MenuItem key="logout" onClick={() => onLogout()}>
                                Logout
                            </MenuItem>
                        </>
                    }
                    </Flex>
                </Menu>
            </Header>
        </>
    )
}