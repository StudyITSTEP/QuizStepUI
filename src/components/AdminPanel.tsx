import { Table, Button, Select, Popconfirm, message, Typography, Tag, Space } from "antd";
import {useLayoutEffect, useState} from "react";
import {
    useGetUsersQuery,
    useSetUserRoleMutation,
    useDeleteUserMutation,
} from "../api/adminApiSlice";
import type { UserWithRolesDto } from "../dto/UserWithRolesDto.ts";
import type {ApiResult} from "../types/ApiResult.ts";

const { Title } = Typography;

const roles = ["Admin", "User", "Moderator"];

const AdminPanel = () => {
    const { data: usersData, isLoading, refetch } = useGetUsersQuery();
    const [setUserRole] = useSetUserRoleMutation();
    const [deleteUser] = useDeleteUserMutation();
    const [users, setUsers] = useState<UserWithRolesDto[]>([]);

    useLayoutEffect(() => {
        if(usersData){
            setUsers(usersData);
        }
    }, [usersData])



    const handleSetRole = async (userId: string, newRoles: string[]) => {
        try {
            // await setUserRole({ userId, roles: newRoles }).unwrap();
            //setUsers((prev) =>
           // //    prev.map((u) => (u.id === userId ? { ...u, roles: newRoles } : u))
           // );
            await setUserRole({roles: newRoles, userId: userId}).unwrap();
            message.success("Role changed successfully.");
            refetch();

        } catch {
            message.error("Ошибка при обновлении ролей");
        }
    };

    const handleDelete = async (userId: string) => {
        try {
            // await deleteUser(userId).unwrap();
            //setUsers((prev) => prev.filter((u) => u.id !== userId));
            message.success("Пользователь удалён");
            deleteUser(userId);
            refetch();
        } catch {
            message.error("Ошибка при удалении");
        }
    };

    const columns = [
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Роли",
            dataIndex: "roles",
            key: "roles",
            render: (roles: string[]) => (
                <Space>
                    {roles.map((r) => (
                        <Tag key={r} color={r === "Admin" ? "red" : r === "Moderator" ? "blue" : "green"}>
                            {r}
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: "Изменить роли",
            key: "action",
            render: (user: UserWithRolesDto) => (
                <Select
                    mode="multiple"
                    placeholder="Выберите роли"
                    defaultValue={user.roles}
                    style={{ minWidth: 200 }}
                    onChange={(values) => handleSetRole(user.id, values)}
                >
                    {roles.map((r) => (
                        <Select.Option key={r} value={r}>
                            {r}
                        </Select.Option>
                    ))}
                </Select>
            ),
        },
        {
            title: "Действия",
            key: "delete",
            render: (user: UserWithRolesDto) => (
                <Popconfirm
                    title="Удалить пользователя?"
                    onConfirm={() => handleDelete(user.id)}
                    okText="Да"
                    cancelText="Нет"
                >
                    <Button danger>Удалить</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div style={{ padding: "2rem" }}>
            <Title level={3}>Управление пользователями</Title>
            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                // loading={isLoading}
                bordered
            />
        </div>
    );
};

export default AdminPanel;