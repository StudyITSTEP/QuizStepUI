import {
    Button,
    Card,
    Col,
    Descriptions,
    type DescriptionsProps,
    Flex,
    Row,
    Space,
    Statistic,
    Tag,
    Typography,
} from "antd";
import {Link, useParams} from "react-router";
import {useGetQuizDetailsQuery} from "../api/quizApiSlice.ts";

export function QuizDetailsPage() {
    const {quizId} = useParams();
    const {data, isLoading} = useGetQuizDetailsQuery(Number(quizId));

    const quiz = data?.value;

    const descriptionItems: DescriptionsProps["items"] = [
        {
            key: "1",
            label: "Email",
            children: (
                <Typography.Link>
                    <Link to={`/user/${quiz?.creatorId}`}>{quiz?.creatorEmail}</Link>
                </Typography.Link>
            ),
        },
        {
            key: "2",
            label: "Name",
            children: <Typography.Text>{quiz?.creatorName}</Typography.Text>,
        },
    ];

    if (isLoading) return null;

    return (
        <>
            <Space direction="vertical" size="large" style={{width: "100%"}}>
                {/* Header */}
                <Card>
                    <Flex align="center" justify="space-between">
                        <Typography.Title level={2} style={{margin: 0}}>
                            {quiz?.name}
                        </Typography.Title>
                        <Tag color={quiz?.access === 0 ? "green" : "red"}>
                            {quiz?.access === 0 ? "Public" : "Private"}
                        </Tag>
                    </Flex>
                    {quiz?.description && (
                        <Typography.Paragraph style={{marginTop: 12}}>
                            {quiz.description}
                        </Typography.Paragraph>
                    )}
                </Card>

                {/* Stats */}
                <Card>
                    <Row gutter={32} justify="space-around">
                        <Col>
                            <Statistic
                                title="Total Questions"
                                value={quiz?.totalQuestions || "No Questions"}
                            />
                        </Col>
                        <Col>
                            <Statistic
                                title="Total Participants"
                                value={quiz?.totalParticipants || "No Participants"}
                            />
                        </Col>
                        <Col>
                            <Statistic
                                title="Average Score"
                                value={quiz?.averageScore || 0}
                                suffix="/ 100"
                            />
                        </Col>
                    </Row>
                </Card>

                {/* Creator */}
                <Card title="Creator" bordered>
                    <Descriptions items={descriptionItems} column={1}/>
                </Card>

                {/* Actions */}
                <Flex justify="center">
                    <Button type="primary" size="large">
                        <Link to={`/quiz/start/${quiz?.id}`}>
                            Start Quiz
                        </Link>
                    </Button>
                </Flex>
            </Space>
        </>
    );
}
