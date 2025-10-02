import { List } from "antd";
import { useGetUserResultsQuery } from "../api/quizResultApiSlice.ts";
import { useAppSelector } from "../app/hooks.ts";
import { selectUser } from "../features/userSlice.ts";
import QuizResultCard from "./QuizResultCard.tsx";


const UserResultsList = () => {
    const user = useAppSelector(selectUser);
    const { data: results, isLoading, error } = useGetUserResultsQuery(user.sub);
    if (error) {
        return <p style={{ color: "red" }}>Ошибка при загрузке результатов</p>;
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>My results</h2>
            <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={results ?? []}
                loading={isLoading}
                renderItem={(item) => (
                    <List.Item>
                        <QuizResultCard result={item} />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default UserResultsList;