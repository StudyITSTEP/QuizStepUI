import { List } from "antd";
import { useGetUserResultsQuery } from "../api/quizResultApiSlice.ts";
import { useAppSelector } from "../app/hooks.ts";
import { selectUser } from "../features/userSlice.ts";
import QuizResultCard from "./QuizResultCard.tsx";

// import type { QuizResultDto } from "../dto/QuizResultDto.ts";

// const mockResults: QuizResultDto[] = [
//     { userId: "1", userEmail: "email1", testId: 101, score: 85 },
//     { userId: "1", userEmail: "email1", testId: 102, score: 92 },
//     { userId: "1", userEmail: "email1", testId: 103, score: 74 },
// ];

const UserResultslist = () => {
    const user = useAppSelector(selectUser);
    const { data: results, isLoading, error } = useGetUserResultsQuery(user.sub);
    if (error) {
        return <p style={{ color: "red" }}>Ошибка при загрузке результатов</p>;
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Мои результаты</h2>
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

export default UserResultslist;