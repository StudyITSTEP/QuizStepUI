import React from "react";
import {Card, Progress, Typography} from 'antd'

import type {QuizResultDto} from "../dto/QuizResultDto.ts";

const {Title, Text} = Typography;

interface QuizResultCardProps {
    result: QuizResultDto;
}

const QuizResultCard: React.FC<QuizResultCardProps> = ({ result }) => {
    return (
        <Card
            hoverable
            style={{ width: 300, margin: "0 auto" }}
            title={`Результат теста №${result.testId}`}
        >
            <Title level={5}>Пользователь: {result.userId}</Title>
            <Text strong>Баллы:</Text>
            <Progress
                percent={Number(result.score)}
                status={result.score >= 50 ? "success" : "exception"}
            />
        </Card>
    );
};

export default QuizResultCard;