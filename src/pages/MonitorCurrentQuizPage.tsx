import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useParams } from "react-router";
import type { ActiveUserDto } from "../dto/ActiveUserDto.ts";
import ParticipantCard from "../components/ParticipantCard.tsx";
import { Empty, Spin, Row, Col, Typography } from "antd";

const { Title } = Typography;

export function MonitorCurrentQuizPage() {
    const { quizId } = useParams();
    const [activeUsers, setActiveUsers] = useState<ActiveUserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = "http://localhost:5207/api/";

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(apiUrl + `quizMonitorHub/${quizId}`, {
                withCredentials: false,
            })
            .withAutomaticReconnect()
            .build();

        connection.on("ActiveUsers", (data: ActiveUserDto[]) => {
            setActiveUsers(data); // avoid concat duplicates
        });

        connection.on("ActiveUser", (data: ActiveUserDto) => {
            if (!data) return;
            setActiveUsers((prev) => {
                const exists = prev.some((a) => a?.userId === data.userId);
                if (exists) return prev;
                return [...prev, data];
            });
        });

        connection.on("ActiveUserFinished", (userId) => {
            setActiveUsers((prev) =>
                prev.filter((p) => p?.userId !== userId)
            );
        });

        connection.on("ActiveUserCurrentQuestion", (userId, question) => {
            setActiveUsers((prev) =>
                prev.map((a) =>
                    a.userId === userId ? { ...a, currentQuestion: question } : a
                )
            );
        });

        connection.start().then(() => {
            console.log("✅ Connected to QuizHub");
            setLoading(false);
        });

        return () => {
            connection.stop().then(() => console.log("🛑 Connection stopped"));
        };
    }, [quizId]);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
                <Spin size="large" tip="Подключаемся к квизу..." />
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <Title level={3} style={{ marginBottom: 20 }}>
                Мониторинг участников
            </Title>

            {activeUsers.length < 1 ? (
                <Empty description="Нет активных участников" />
            ) : (
                <Row gutter={[16, 16]}>
                    {activeUsers.map((user) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={user.userId}>
                            <ParticipantCard {...user} />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}
