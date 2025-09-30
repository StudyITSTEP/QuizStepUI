import { Table } from "antd";
import { useGetUserResultsQuery } from "../api/quizApi.ts";
import { useAppSelector } from "../app/hooks.ts";
import { selectUser } from "../features/userSlice.ts";

const UserResultsPage = () => {
    const user = useAppSelector(selectUser);
    const { data: results, isLoading, error } = useGetUserResultsQuery(user.sub);

    const columns = [
        { title: "Test ID", dataIndex: "testId", key: "testId" },
        { title: "Score", dataIndex: "score", key: "score" },
    ];

    if (error) {
        return <p style={{ color: "red" }}>Ошибка при загрузке результатов</p>;
    }

    return (
        <div>
            <h2>Мои результаты</h2>
            <Table
                dataSource={results ?? []}
                columns={columns}
                rowKey="testId"
                loading={isLoading}
                pagination={false}
            />
        </div>
    );
};

export default UserResultsPage;