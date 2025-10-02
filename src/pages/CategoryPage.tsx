import { Button, Flex, Input, Table, Typography, Space, message } from "antd";
import type { TableColumnsType } from "antd";
import type { Category } from "../entities/Category.ts";
import { useAddCategoryMutation, useCategoriesQuery, useDeleteCategoryMutation } from "../api/categoryApiSlice.ts";
import { useState } from "react";

const { Title } = Typography;

export function CategoryPage() {
    const [newCategory, setNewCategory] = useState<string>("");

    const [addCategory] = useAddCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
    const { data, isLoading, refetch } = useCategoriesQuery();

    const deleteCategoryHandler = async (id: number) => {
        await deleteCategory(id);
        message.success("Category deleted");
        refetch();
    };

    const addCategoryHandler = async () => {
        if (!newCategory.trim()) {
            message.warning("Please enter a category name");
            return;
        }
        await addCategory(newCategory.trim());
        message.success("Category added");
        setNewCategory("");
        refetch();
    };

    const columns: TableColumnsType<Category> = [
        { title: "Id", dataIndex: "id", key: "id", width: "10%" },
        { title: "Name", dataIndex: "name", key: "name" },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (col: Category) => (
                <Button
                    type="primary"
                    danger
                    onClick={() => deleteCategoryHandler(col.id!)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: "2rem" }}>
            <Flex justify="space-between" align="center" style={{ marginBottom: "1.5rem" }}>
                <Title level={3}>Categories</Title>
                <Space>
                    <Input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New Category"
                        style={{ width: 200 }}
                    />
                    <Button type="primary" onClick={addCategoryHandler}>
                        Add Category
                    </Button>
                </Space>
            </Flex>

            <Table<Category>
                columns={columns}
                dataSource={data}
                loading={isLoading}
                rowKey="id"
                bordered
            />
        </div>
    );
}
