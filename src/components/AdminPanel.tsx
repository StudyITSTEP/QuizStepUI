import { Table, Button, Select, Popconfirm, message } from "antd";
import { useState } from "react";
import {
    useGetUsersQuery,
    useSetUserRoleMutation,
    useDeleteUserMutation,
} from "../api/adminApiSlice";
import type { UserWithRolesDto } from "../dto/UserWithRolesDto.ts";

const mockUsers: UserWithRolesDto[] = [
    { id: "1", email: "teacher@example.com", roles: ["Moderator"] },
    { id: "2", email: "student1@example.com", roles: ["User"] },
    { id: "3", email: "admin@example.com", roles: ["Admin"] },
];

const roles = ["Admin", "User", "Moderator"];

const AdminPanel = () => {
    // const { data: users, isLoading } = useGetUsersQuery();
    const [setUserRole] = useSetUserRoleMutation();
    const [deleteUser] = useDeleteUserMutation();

    const [users, setUsers] = useState<UserWithRolesDto[]>(mockUsers);

    const handleSetRole = async (userId: string, role: string) => {
        try {
            // await setUserRole({ userId, role }).unwrap();

            setUsers((prev) =>
                prev.map((u) =>
                    u.id === userId ? { ...u, roles: [role] } : u
                )
            );

            message.success("Роль обновлена");
        } catch {
            message.error("Ошибка при обновлении роли");
        }
    };

    const handleDelete = async (userId: string) => {
        try {
            // await deleteUser(userId).unwrap();
            setUsers((prev) => prev.filter((u) => u.id !== userId));

            message.success("Пользователь удалён");
        } catch {
            message.error("Ошибка при удалении");
        }
    };

    const columns = [
        { title: "Email", dataIndex: "email", key: "email" },
        {
            title: "Изменить роль",
            key: "action",
            render: (user: UserWithRolesDto) => (
                <Select
                    defaultValue={user.roles[0]}
                    style={{ width: 120 }}
                    onChange={(role) => handleSetRole(user.id, role)}
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
        <Table
            dataSource={users}
            columns={columns}
            rowKey="id"
            // loading={isLoading}
        />
    );
};

export default AdminPanel;