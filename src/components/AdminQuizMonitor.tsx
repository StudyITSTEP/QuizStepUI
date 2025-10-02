import React, {useEffect, useState} from "react";
import {Button, Card, List} from "antd";
import * as signalR from "@microsoft/signalr";
import {useAppSelector} from "../app/hooks.ts";
import {selectUser} from "../features/userSlice.ts";
import {Link} from "react-router";

interface AdminQuizMonitorProps {
    quizId: number;
    adminId: string;
}

const AdminQuizMonitor: React.FC<AdminQuizMonitorProps> = ({quizId, adminId}) => {
    const [activeQuizzes, setActiveQuizzes] = useState<{ quizId: number, quizName: string }[]>([]);
    const user = useAppSelector(selectUser)
    const apiUrl = "http://localhost:5207/api/";

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(apiUrl + `creatorHub?userId=${user.sub}`, {
                withCredentials: false
            })
            .withAutomaticReconnect()
            .build();

        connection.on("ActiveUsersList", (data) => {
            const activeUserList = data as { quizId: number, quizName: string }[]
            setActiveQuizzes(prev => prev.concat(activeUserList));
        })

        connection.start().then(async () => {
            console.log("Connected to QuizHub");

        });


        return () => {
            connection.stop().then(() => console.log("Connection Stop"));
        };
    }, [quizId, adminId]);

    return (
        <div>
            <h2>Мониторинг прохождения теста</h2>
            <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={activeQuizzes}
                renderItem={(participant) => (
                    <List.Item key={1}>
                        <Card>
                            <div>{participant.quizId}</div>
                            <div>{participant.quizName}</div>
                            <Button>
                                <Link to={`${participant.quizId}`}>Monitor</Link>
                            </Button>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default AdminQuizMonitor;