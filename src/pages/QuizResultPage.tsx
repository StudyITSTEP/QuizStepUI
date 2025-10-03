import { useParams } from "react-router";
import { useGetResultsByQuizIdQuery } from "../api/quizResultApiSlice.ts";
import QuizResultCard from "../components/QuizResultCard.tsx";
import { Typography, Spin, Empty, List } from "antd";

const { Title } = Typography;

export function QuizResultPage() {
    const { quizId } = useParams();
    const { data: results, isLoading } = useGetResultsByQuizIdQuery(quizId!);

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
                <Spin size="large" tip="Загрузка результатов..." />
            </div>
        );
    }

    return (
        <div style={{ padding: "24px" }}>
            <Title level={3} style={{ marginBottom: 20 }}>
                Результаты теста
            </Title>

            {results && results.length > 0 ? (
                <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={results}
                    pagination={{ pageSize: 6 }}
                    renderItem={(result) => (
                        <List.Item key={result.quizId}>
                            <QuizResultCard result={result} />
                        </List.Item>
                    )}
                />
            ) : (
                <Empty description="Нет доступных результатов" />
            )}
        </div>
    );
}
