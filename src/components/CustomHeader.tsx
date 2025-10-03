import {Header} from "antd/es/layout/layout";
import {Avatar, Button, Flex, Menu, Space, Typography} from "antd";
import {Link, useNavigate} from "react-router";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {logout, selectUser} from "../features/userSlice.ts";
import type {CustomMenuItems} from "../types/CustomMenuItem.ts";
import {isUserInRole} from "../services/userManager.ts";

const {Text} = Typography;

export function CustomHeader() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);

    const onLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    let items: CustomMenuItems[] = [
        {
            key: "home",
            label: <Link to={"/home"}>Home</Link>,
            authOnly: true,
        },
        {
            key: "laboratory",
            label: <Link to={"/laboratory"}>Laboratory</Link>,
            authOnly: true,
        },
        {
            key: "admin",
            label: <Link to={"/admin"}>Admin Panel</Link>,
            authOnly: true,
            roles: ["Admin"],
        },
    ];

    items = items.filter(
        (item) =>
            user.isAuthenticated &&
            item.authOnly &&
            (item.roles === undefined || isUserInRole(user, item.roles))
    );

    return (
        <Header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 32px",
                background: "#001529",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
        >
            {/* Left side: App name */}
            <Link to="/home" style={{color: "white", fontSize: 20, fontWeight: 600}}>
                Quiz Platform
            </Link>

            {/* Middle: Menu */}
            <Menu
                mode="horizontal"
                theme="dark"
                items={items}
                style={{
                    flex: 1,
                    marginLeft: 40,
                    minWidth: 300,
                    background: "transparent",
                    borderBottom: "none",
                }}
                defaultSelectedKeys={["home"]}
            />

            {/* Right side: User info & Logout */}
            {user.isAuthenticated && (
                <Flex align="center" gap="large">
                    <Space direction={"horizontal"} >
                        <Avatar style={{backgroundColor: "#1890ff"}}>
                            {user.firstName?.[0]?.toUpperCase() || "U"}
                        </Avatar>
                        <div style={{color: "white", textAlign: "right"}}>
                            <Text style={{color: "white", fontWeight: 500}}>
                                {user.firstName} {user.lastName}
                            </Text>
                        </div>
                    </Space>
                        <Button  color={"danger"} onClick={onLogout}>
                            Logout
                        </Button>
                </Flex>
            )}
        </Header>
    );
}
