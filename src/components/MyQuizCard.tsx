import { Button, Card, Tag, Space, Typography } from "antd";
import { Link } from "react-router";
import { QuizAccess } from "../dto/QuizAccess.ts";
import { useDeleteQuizMutation, useGetMyQuizzesQuery } from "../api/quizApiSlice.ts";
import { useAppSelector } from "../app/hooks.ts";
import { selectUser } from "../features/userSlice.ts";
import type { QuizDetailsDto } from "../dto/QuizDetailsDto.ts";

const { Paragraph, Text } = Typography;

export function MyQuizCard(quiz: QuizDetailsDto) {
    const [deleteQuiz] = useDeleteQuizMutation();
    const user = useAppSelector(selectUser);
    const { refetch: refetchMyQuizzes } = useGetMyQuizzesQuery(user.sub);

    const deleteQuizHandler = async () => {
        await deleteQuiz(quiz.id);
        refetchMyQuizzes();
    };

    return (
        <Card
            title={<Text strong>{quiz.name}</Text>}
            extra={
                quiz.access === QuizAccess.Public ? (
                    <Tag color="green">Public</Tag>
                ) : (
                    <Tag color="red">Private</Tag>
                )
            }
            style={{ width: 400, margin: "1rem auto", borderRadius: 8 }}
            hoverable
        >
            <Paragraph>{quiz.description || <Text type="secondary">No description provided.</Text>}</Paragraph>
            {quiz.accessCode && (
                <Paragraph>
                    <Text strong>Access Code: </Text>
                    <Text code>{quiz.accessCode}</Text>
                </Paragraph>
            )}
            <Space style={{ marginTop: 16 }}>
                <Link to={`/quiz/${quiz.id}`}>
                    <Button type="primary">Details</Button>
                </Link>
                <Link to={`/quiz/${quiz.id}/edit`}>
                    <Button>Edit</Button>
                </Link>
                <Button danger onClick={deleteQuizHandler}>
                    Delete
                </Button>
            </Space>
        </Card>
    );
}
