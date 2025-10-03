import {Button, Card, Tag, Space, Typography} from "antd";
import {Link} from "react-router";
import {QuizAccess} from "../dto/QuizAccess.ts";
import {useDeleteQuizMutation, useGetMyQuizzesQuery} from "../api/quizApiSlice.ts";
import {useAppSelector} from "../app/hooks.ts";
import {selectUser} from "../features/userSlice.ts";
import type {QuizDetailsDto} from "../dto/QuizDetailsDto.ts";

const {Paragraph, Text} = Typography;

export function MyQuizCard(quiz: QuizDetailsDto) {
    const [deleteQuiz] = useDeleteQuizMutation();
    const user = useAppSelector(selectUser);
    const {refetch: refetchMyQuizzes} = useGetMyQuizzesQuery(user.sub);

    const deleteQuizHandler = async () => {
        await deleteQuiz(quiz.id);
        refetchMyQuizzes();
    };

    return (
        <Card
            title={<Text strong>{quiz.name}</Text>}
            extra={
                <Tag color={quiz.access === QuizAccess.Public ? "green" : "red"}>
                    {quiz.access === QuizAccess.Public ? "Public" : "Private"}
                </Tag>
            }
            hoverable
            style={{
                width: 400,
                minHeight: 250, // ensures all cards are uniform
                margin: "1rem auto",
                borderRadius: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <div>
                <Paragraph ellipsis={{rows: 3}}>
                    {quiz.description || <Text type="secondary">No description provided.</Text>}
                </Paragraph>

                {quiz.accessCode !== 0 && (
                    <Paragraph>
                        <Text strong>Access Code: </Text>
                        <Text code>{quiz.accessCode}</Text>
                    </Paragraph>)
                }
            </div>

            <Space style={{marginTop: 16}}>
                <Link to={`/quiz/${quiz.id}`}>
                    <Button type="primary">Details</Button>
                </Link>
                <Link to={`quiz/edit/${quiz.id}`}>
                    <Button>Edit</Button>
                </Link>
                <Button danger onClick={deleteQuizHandler}>
                    Delete
                </Button>
            </Space>
        </Card>
    );
}
