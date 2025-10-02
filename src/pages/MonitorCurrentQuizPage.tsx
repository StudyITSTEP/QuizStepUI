import {useLayoutEffect, useState} from "react";
import * as signalR from "@microsoft/signalr";
import {useParams} from "react-router";
import type {ActiveUserDto} from "../dto/ActiveUserDto.ts";
import {List} from "antd";
import ListItem from "antd/es/upload/UploadList/ListItem";
import ParticipantCard from "../components/ParticipantCard.tsx";

export function MonitorCurrentQuizPage() {
    const {quizId} = useParams();
    const [activeUsers, setActiveUsers] = useState<ActiveUserDto[]>([]);
    const apiUrl = "http://localhost:5207/api/";

    useLayoutEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(apiUrl + `quizMonitorHub/${quizId}`, {
                withCredentials: false
            })
            .withAutomaticReconnect()
            .build();

        connection.on("ActiveUsers", (data: ActiveUserDto) => {
            setActiveUsers(prev => prev.concat(data));
            console.log("Current Question", data);
        });
        connection.on("ActiveUserCurrentQuestion", (userId) => {
            console.log("Current Question", userId);
        });

        connection.start().then(async () => {
            console.log("Connected to QuizHub");

        });
        return () => {
            connection.stop().then(() => console.log("Connection Stop"));
        };
    },[quizId]);

    return (
        <>
            {activeUsers.map((user) => (
                <ParticipantCard {...user}/>
            ))}
        </>
    )
}