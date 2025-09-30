import {Button, Table, type TableColumnsType} from "antd";
import type {Category} from "../entities/Category.ts";
import {useCategoriesQuery} from "../api/categoryApiSlice.ts";

export function CategoryPages() {
    const {data, isLoading} = useCategoriesQuery();
    const deleteCategory = async (id: number) => {
        console.log(id);
    }

    const columns: TableColumnsType<Category> = [
        {title: 'Id', dataIndex: 'id', key: 'id'},
        {title: 'Name', dataIndex: 'name', key: 'name'},
        {
            title: 'Delete',
            dataIndex: '',
            key: 'delete',
            render: (col: Category) => <Button type='text' color={"danger"}
                                               onClick={() => deleteCategory(col.id!)}>Delete</Button>,
        },
    ];
    const items: Category[] = [
        {id: 1, name: "asd"}
    ]
    return <>
        <Table<Category> columns={columns} dataSource={data} loading={isLoading}/>
    </>
}