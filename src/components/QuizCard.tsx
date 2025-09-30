import React from "react";
import { Card, Button, Tag } from "antd";
import type {QuizDto} from "../dto/QuizDto.tsx";
import { QuizAccess } from "../dto/QuizAccess.tsx";

interface QuizCardProps {
    quiz: QuizDto;
    onStart: (quizId: number) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStart }) => {
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
                onClick={() => onStart(quiz.id)}
                disabled={quiz.quizAccess === QuizAccess.Private}
            >
                Начать
            </Button>
        </Card>
    );
};

export default QuizCard;