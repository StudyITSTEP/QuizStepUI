import React from "react";
import { List } from "antd";
import ParticipantCard from "./ParticipantCard.tsx";
import type { QuizParticipantProgressDto } from "../dto/QuizParticipantProgressDto.ts";

const mockParticipants: QuizParticipantProgressDto[] = [
    { userId: "1", userName: "1", currentQuestion: 3, totalQuestions: 10 },
    { userId: "2", userName: "2", currentQuestion: 7, totalQuestions: 10 },
    { userId: "3", userName: "3", currentQuestion: 10, totalQuestions: 10 },
];

const AdminQuizMonitor: React.FC = () => {

    // const { data: participants, isLoading, error } = useGetQuizParticipantsQuery();

    // if (error) {
    //     return <p style={{ color: "red" }}>Ошибка при загрузке участников</p>;
    // }

    return (
        <div>
            <h2>Мониторинг прохождения теста</h2>
            <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={mockParticipants ?? []}
                // loading={isLoading}
                renderItem={(participant: QuizParticipantProgressDto) => (
                    <List.Item>
                        <ParticipantCard participant={participant} />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default AdminQuizMonitor;