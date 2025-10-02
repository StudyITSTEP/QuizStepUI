import { useGetMyQuizzesQuery } from "../api/quizApiSlice.ts";
import { Link } from "react-router";
import { Button, Spin, Row, Col, Typography, Empty } from "antd";
import { MyQuizCard } from "../components/MyQuizCard.tsx";
import { useAppSelector } from "../app/hooks.ts";
import { selectUser } from "../features/userSlice.ts";
import type { QuizDetailsDto } from "../dto/QuizDetailsDto.ts";

const { Title } = Typography;

export function MyQuizzesPage() {
    const user = useAppSelector(selectUser);
    const { data, isLoading } = useGetMyQuizzesQuery(user.sub);

    return (
        <div style={{ padding: "2rem" }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: "1.5rem" }}>
                <Col>
                    <Title level={2}>My Quizzes</Title>
                </Col>
                <Col>
                    <Link to="quizzes/new">
                        <Button type="primary">+ New Quiz</Button>
                    </Link>
                </Col>
            </Row>

            {isLoading ? (
                <Row justify="center" style={{ marginTop: "4rem" }}>
                    <Spin size="large" />
                </Row>
            ) : (
                <>
                    {data && data.length > 0 ? (
                        <Row gutter={[24, 24]}>
                            {data.map((quiz: QuizDetailsDto) => (
                                <Col key={quiz.id} xs={24} sm={12} md={8} lg={6}>
                                    <MyQuizCard {...quiz} />
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Empty description="No quizzes yet. Create your first quiz!" style={{ marginTop: "4rem" }} />
                    )}
                </>
            )}
        </div>
    );
}
