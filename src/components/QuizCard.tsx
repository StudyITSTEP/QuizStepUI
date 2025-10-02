import React from "react";
import { Card, Button, Tag } from "antd";
import { QuizAccess } from "../dto/QuizAccess.ts";
import {Link} from "react-router";
import type {QuizDetailsDto} from "../dto/QuizDetailsDto.ts";

interface QuizCardProps {
    quiz: QuizDetailsDto;
    onStart: (quizId: number) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStart }) => {
    return (
        <Card
            title={quiz.name}
            extra={
                quiz.access === QuizAccess.Public ? (
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
            >
                <Link to={`/quiz/${quiz.id}`}>
                    Details
                </Link>
            </Button>
        </Card>
    );
};

export default QuizCard;