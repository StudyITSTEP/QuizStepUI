import type {QuizDto} from "../dto/QuizDto.tsx";
import {Button, Card, Tag} from "antd";
import {QuizAccess} from "../dto/QuizAccess.tsx";
import { Link } from "react-router";

export function MyQuizCard(quiz: QuizDto) {

    return (
        <Card
            title={quiz.name}
            extra={
                quiz.quizAccess === QuizAccess.Public ? (
                    <Tag color="green">Public</Tag>
                ) : (
                    <Tag color="red">Private</Tag>
                )
            }
        >
            <p>{quiz.description}</p>
            <Button
                type="primary"
            >
                <Link to={`quiz/${quiz.id}`}>Edit</Link>
            </Button>
            <Button danger type={"primary"}>
                Delete
            </Button>
        </Card>
    );
}