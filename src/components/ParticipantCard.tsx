import { Card, Progress, Typography, Avatar, Space } from "antd";
import type { ActiveUserDto } from "../dto/ActiveUserDto.ts";

const { Text } = Typography;

const ParticipantCard = ({ ...participant }: ActiveUserDto) => {
    const percent = Math.round(
        (participant.currentQuestion / participant.totalQuestions) * 100
    );

    // Fallback avatar initials
    const initials = participant.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return (
        <Card
            hoverable
            style={{ width: 400, borderRadius: 10 }}
            bodyStyle={{ padding: 20 }}
        >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                {/* Header with avatar + name */}
                <Space align="center">
                    <Avatar style={{ backgroundColor: "#1890ff" }} size={48}>
                        {initials}
                    </Avatar>
                    <div>
                        <Text strong style={{ fontSize: 16 }}>
                            {participant.fullName}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            {participant.email}
                        </Text>
                    </div>
                </Space>

                {/* Progress info */}
                <div>
                    <Text strong style={{ marginRight: 8 }}>
                        Вопрос {participant.currentQuestion} из {participant.totalQuestions}
                    </Text>
                    <Progress
                        percent={percent}
                        status="active"
                        strokeColor={{
                            from: "#108ee9",
                            to: "#87d068",
                        }}
                    />
                </div>
            </Space>
        </Card>
    );
};

export default ParticipantCard;
