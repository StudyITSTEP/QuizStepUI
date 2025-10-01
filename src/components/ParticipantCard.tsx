import React from "react";
import { Card, Progress, Typography } from "antd";
import type { QuizParticipantProgressDto } from "../dto/QuizParticipantProgressDto";

const { Text } = Typography;

interface ParticipantCardProps {
    participant: QuizParticipantProgressDto;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant }) => {
    const percent = Math.round(
        (participant.currentQuestion / participant.totalQuestions) * 100
    );

    return (
        <Card
            hoverable
            style={{ width: 500 }}
            title={participant.userName}
        >
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Text strong>Текущий вопрос:</Text>
                <p>
                    {participant.currentQuestion}/{participant.totalQuestions}
                </p>
                <Progress percent={percent} status="active" />
            </div>
        </Card>
    );
};

export default ParticipantCard;