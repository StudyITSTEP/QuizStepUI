import { Card, Progress, Typography } from "antd";
import type {ActiveUserDto} from "../dto/ActiveUserDto.ts";

const { Text } = Typography;


const ParticipantCard = ({ ...participant }: ActiveUserDto) => {
    const percent = Math.round(
        (participant.currentQuestion / participant.totalQuestions) * 100
    );

    return (
        <Card
            hoverable
            style={{ width: 500 }}
            title={participant.fullName}
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