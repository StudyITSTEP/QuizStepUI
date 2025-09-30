import {Layout, Menu} from "antd";
import type {CustomMenuItems} from "../types/CustomMenuItem.ts";
import {Link, Outlet} from "react-router";
import {Content} from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import {isUserInRole} from "../services/userManager.ts";
import {useAppSelector} from "../app/hooks.ts";
import {selectUser} from "../features/userSlice.ts";



export function LaboratoryPage() {
    const user = useAppSelector(selectUser);


    let items: CustomMenuItems[] = [
        {
            key: "myQuizzes",
            label:<Link to={"/laboratory"}>My Quizzes</Link>
        },
        {
            key: "categories",
            label: <Link to={"categories"}>Categories</Link>,
            roles: ["Moderator", "Admin"]
        }
    ]

    items = items.filter(item => {
        return item.roles === undefined || item.roles && isUserInRole(user, item.roles)
    })

    return (
        <Layout>
            <Sider width={200}>
            <Menu mode="inline" style={{ height: "100%" }} items={items} defaultSelectedKeys={['myQuizzes']}/>
            </Sider>
            <Content>
                <Outlet/>
            </Content>
        </Layout>
    )
}