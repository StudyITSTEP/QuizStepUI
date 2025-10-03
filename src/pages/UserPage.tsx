import { useParams } from "react-router";
import { useGetUserDetailsQuery } from "../api/userApiSplice.ts";
import { Spin, Typography, Avatar, Row, Col, Empty } from "antd";
import { useGetMyQuizzesQuery } from "../api/quizApiSlice.ts";
import QuizCard from "../components/QuizCard.tsx";

const { Title, Text } = Typography;

export function UserPage() {
    const { userId } = useParams();
    const { data: user, isLoading } = useGetUserDetailsQuery(userId!);
    const { data: quizzes, isLoading: quizzesLoading } = useGetMyQuizzesQuery(userId!);

    if (isLoading || quizzesLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
                <Spin size="large" tip="Загрузка профиля..." />
            </div>
        );
    }

    if (!user) {
        return <Empty description="Пользователь не найден" />;
    }

    return (
        <div style={{ padding: "24px" }}>
            {/* User Profile Section */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
                <Avatar size={64} style={{ backgroundColor: "#1890ff", marginRight: 16 }}>
                    {user.firstName?.[0]}
                </Avatar>
                <div>
                    <Title level={4} style={{ marginBottom: 4 }}>
                        {user.firstName} {user.lastName}
                    </Title>
                    <Text type="secondary">{user.email}</Text>
                </div>
            </div>

            {/* Quizzes Section */}
            <Title level={5} style={{ marginBottom: 16 }}>
                Created Tests
            </Title>

            {quizzes && quizzes.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {quizzes.map((quiz) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={quiz.id}>
                            <QuizCard quiz={quiz} onStart={() => {}} />
                        </Col>
                    ))}
                </Row>
            ) : (
                <Empty description="У пользователя пока нет созданных тестов" />
            )}
        </div>
    );
}
