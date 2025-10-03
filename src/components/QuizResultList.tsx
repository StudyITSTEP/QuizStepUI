import { Button, Card, List, Typography, Empty } from "antd";
import { useGetUserResultsQuery } from "../api/quizResultApiSlice.ts";
import { useAppSelector } from "../app/hooks.ts";
import { selectUser } from "../features/userSlice.ts";
import QuizResultCard from "./QuizResultCard.tsx";
import { useGetMyQuizzesQuery } from "../api/quizApiSlice.ts";
import { Link } from "react-router";

const { Title, Text } = Typography;

const UserResultsList = () => {
    const user = useAppSelector(selectUser);
    const { data: results, isLoading, error } = useGetUserResultsQuery(user.sub);
    const { data: myQuizzes } = useGetMyQuizzesQuery(user.sub);

    if (error) {
        return <p style={{ color: "red" }}>Ошибка при загрузке результатов</p>;
    }

    return (
        <div style={{ padding: 20 }}>
            <Title level={3} style={{ marginBottom: 20 }}>
                Мои результаты
            </Title>

            {/* User Results */}
            {results && results.length > 0 ? (
                <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={results}
                    loading={isLoading}
                    pagination={{ pageSize: 6 }}
                    renderItem={(item) => (
                        <List.Item>
                            <QuizResultCard result={item} />
                        </List.Item>
                    )}
                />
            ) : (
                <Empty description="Нет результатов" />
            )}

            {/* My Quizzes Summary */}
            {myQuizzes && myQuizzes.length > 0 && (
                <>
                    <Title level={4} style={{ marginTop: 40, marginBottom: 20 }}>
                        Мои тесты
                    </Title>
                    <List
                        grid={{ gutter: 16, column: 3 }}
                        dataSource={myQuizzes}
                        pagination={{ pageSize: 6 }}
                        renderItem={(quiz) => (
                            <List.Item key={quiz.id}>
                                <Card
                                    title={<Text strong>{quiz.name}</Text>}
                                    hoverable
                                    style={{ minHeight: 180, borderRadius: 8, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                >
                                    <div>
                                        <Text type="secondary">Average Score: {quiz.averageScore ?? "-"}</Text>
                                    </div>
                                    <Button type="primary" style={{ marginTop: 16 }}>
                                        <Link to={`quiz/${quiz.id}`} style={{ color: "white" }}>
                                            See Results
                                        </Link>
                                    </Button>
                                </Card>
                            </List.Item>
                        )}
                    />
                </>
            )}
        </div>
    );
};

export default UserResultsList;
