import {
    Button,
    Card,
    Col,
    Descriptions,
    Flex,
    Row,
    Skeleton,
    Space,
    Statistic,
    Tag,
    Typography,
} from "antd";
import {Link, useParams} from "react-router";
import {useGetQuizDetailsQuery} from "../api/quizApiSlice.ts";
import {useCategoriesQuery} from "../api/categoryApiSlice.ts";

const {Title, Paragraph, Text, Link: AntLink} = Typography;

export function QuizDetailsPage() {
    const {quizId} = useParams();
    const {data, isLoading} = useGetQuizDetailsQuery(Number(quizId));
    const {data: categories} = useCategoriesQuery();


    const quiz = data?.value;
    const categoryName = categories?.find(c => c.id === quiz?.categoryId)?.name || "Uncategorized";


    if (isLoading) {
        return (
            <Card style={{maxWidth: 900, margin: "40px auto"}}>
                <Skeleton active paragraph={{rows: 4}}/>
            </Card>
        );
    }

    if (!quiz) {
        return (
            <Flex justify="center" align="center" style={{minHeight: "60vh"}}>
                <Text type="secondary">Quiz not found</Text>
            </Flex>
        );
    }

    return (
        <Space
            direction="vertical"
            size="large"
            style={{width: "100%", maxWidth: 900, margin: "0 auto", padding: "24px"}}
        >
            {/* Header */}
            <Card
                style={{borderRadius: 8}}
            >
                <Flex align="center" justify="space-between" wrap="wrap">
                    <Title level={2} style={{margin: 0}}>
                        {quiz.name}
                    </Title>
                    <Tag
                        color={quiz.access === 0 ? "green" : "red"}
                        style={{fontSize: 14, padding: "4px 12px"}}
                    >
                        {quiz.access === 0 ? "Public" : "Private"}
                    </Tag>
                </Flex>
                {quiz.description && (
                    <Paragraph style={{marginTop: 16}}>
                        {quiz.description}
                    </Paragraph>
                )}
                <Tag color={"blue"} style={{marginTop: 8, fontSize: 16}}>
                    {categoryName}
                </Tag>
            </Card>

            {/* Stats */}
            <Card style={{borderRadius: 8}}>
                <Row gutter={[32, 32]} justify="space-around">
                    <Col xs={24} sm={8}>
                        <Statistic
                            title="Total Questions"
                            value={quiz.totalQuestions || 0}
                        />
                    </Col>
                    <Col xs={24} sm={8}>
                        <Statistic
                            title="Participants"
                            value={quiz.totalParticipants || 0}
                        />
                    </Col>
                    <Col xs={24} sm={8}>
                        <Statistic
                            title="Average Score"
                            value={quiz.averageScore || 0}
                            suffix="/ 100"
                        />
                    </Col>
                </Row>
            </Card>

            {/* Creator */}
            <Card title="Creator" style={{borderRadius: 8}}>
                <Descriptions column={1}>
                    <Descriptions.Item label="Email">
                        <AntLink>
                            <Link to={`/user/${quiz.creatorId}`}>
                                {quiz.creatorEmail}
                            </Link>
                        </AntLink>
                    </Descriptions.Item>
                    <Descriptions.Item label="Name">
                        {quiz.creatorName}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Actions */}
            <Flex justify="center">
                <Button type="primary" size="large" style={{minWidth: 200}}>
                    <Link to={`/quiz/start/${quiz.id}`}>Start Quiz</Link>
                </Button>
            </Flex>
        </Space>
    );
}
