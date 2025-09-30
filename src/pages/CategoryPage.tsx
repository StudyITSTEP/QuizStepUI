import {Button, Flex, Input, Table, type TableColumnsType} from "antd";
import type {Category} from "../entities/Category.ts";
import {useAddCategoryMutation, useCategoriesQuery, useDeleteCategoryMutation} from "../api/categoryApiSlice.ts";
import {useState} from "react";

export function CategoryPage() {
    const [newCategory, setNewCategory] = useState<string>("");

    const [addCategory] = useAddCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
    const {data, isLoading, refetch} = useCategoriesQuery();
    const deleteCategoryHandler = async (id: number) => {
        await deleteCategory(id)
        refetch();
    }
    const addCategoryHandler = async () => {
        await addCategory(newCategory);
        refetch();
    }

    const columns: TableColumnsType<Category> = [
        {title: 'Id', dataIndex: 'id', key: 'id'},
        {title: 'Name', dataIndex: 'name', key: 'name'},
        {
            title: 'Delete',
            dataIndex: '',
            key: 'delete',
            render: (col: Category) => <Button type='primary' danger
                                               onClick={() => deleteCategoryHandler(col.id!)}>Delete</Button>,
        },
    ];


    return <>
        <Flex style={{width: '20%'}}>
            <Button type="primary" onClick={() => addCategoryHandler()}>Add Category</Button>
            <Input onChange={(e) => setNewCategory(e.target.value)} placeholder="New Category"/>
        </Flex>
        <Table<Category> columns={columns} dataSource={data} loading={isLoading}/>
    </>
}