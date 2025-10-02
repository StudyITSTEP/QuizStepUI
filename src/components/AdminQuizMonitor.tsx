import React, { useEffect, useState } from "react";
import { List } from "antd";
import * as signalR from "@microsoft/signalr";
import ParticipantCard from "./ParticipantCard";
import type { QuizParticipantProgressDto } from "../dto/QuizParticipantProgressDto";

interface AdminQuizMonitorProps {
    quizId: number;
    adminId: string;
}

const AdminQuizMonitor: React.FC<AdminQuizMonitorProps> = ({ quizId, adminId }) => {
    const [participants, setParticipants] = useState<QuizParticipantProgressDto[]>([]);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:5001/quizHub")
            .withAutomaticReconnect()
            .build();

        connection.start().then(async () => {
            console.log("Connected to QuizHub");
            await connection.invoke("JoinAsAdmin", quizId, adminId);
        });

        connection.on("ReceiveParticipantProgress", (progress: QuizParticipantProgressDto) => {
            setParticipants(prev => {
                const exists = prev.find(p => p.userId === progress.userId);
                if (exists) {
                    return prev.map(p => p.userId === progress.userId ? progress : p);
                }
                return [...prev, progress];
            });
        });

        return () => {
            connection.stop();
        };
    }, [quizId, adminId]);

    return (
        <div>
            <h2>Мониторинг прохождения теста</h2>
            <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={participants}
                renderItem={(participant) => (
                    <List.Item key={participant.userId}>
                        <ParticipantCard participant={participant} />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default AdminQuizMonitor;