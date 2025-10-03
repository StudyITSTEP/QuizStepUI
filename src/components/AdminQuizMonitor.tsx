import {useEffect, useState} from 'react';
import {Button, Card, Empty, List} from 'antd';
import * as signalR from '@microsoft/signalr';
import {useAppSelector} from '../app/hooks';
import {selectUser} from '../features/userSlice';
import {Link} from 'react-router';

interface Quiz {
    quizId: number;
    quizName: string;
}

const AdminQuizMonitor = () => {
    const [activeQuizzes, setActiveQuizzes] = useState<Quiz[]>([]);
    const user = useAppSelector(selectUser);
    const apiUrl = 'http://localhost:5207/api/';

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${apiUrl}creatorHub?userId=${user.sub}`, {
                withCredentials: false,
            })
            .withAutomaticReconnect()
            .build();

        connection.on('ActiveQuizList', (data: Quiz[]) => {
            setActiveQuizzes((prev) => {
                if (!data || data.length === 0) {
                    return prev;
                }

                // Update or add quizzes
                const updated = data.map((newQuiz) => {
                    const existing = prev.find((q) => q.quizId === newQuiz.quizId);
                    return existing ? {...existing} : {...newQuiz};
                });

                // Merge: keep old quizzes that aren't in the new list
                const untouched = prev.filter(
                    (q) => !data.some((a) => a.quizId === q.quizId),
                );

                return [...untouched, ...updated];
            });
        });

        connection.on('ActiveQuiz', (data: Quiz) => {
            console.log('Active Quiz', data);
            if (!data) return;

            setActiveQuizzes((prev) => {
                const existed = prev.find((q) => q.quizId === data.quizId);
                if (!existed) {
                    return [...prev, {quizId: data.quizId, quizName: data.quizName}];
                }
                return prev;
            });
        });

        connection.on('QuizEmpty', (quizId: number) => {
            if (quizId) {
                setActiveQuizzes((prev) => prev.filter((q) => q.quizId !== quizId));
            }
        });

        connection
            .start()
            .then(() => console.log('Connected to QuizHub'))
            .catch((err) => console.error('Connection failed:', err));

        return () => {
            connection
                .stop()
                .then(() => console.log('Connection stopped'))
                .catch((err) => console.error('Disconnection failed:', err));
        };
    }, [user]);

    return (
        <div style={{padding: '24px'}}>
            <h2>Current Active Quizzes</h2>
            {activeQuizzes.length === 0 ? <Empty /> :
            <List
                dataSource={activeQuizzes}
                renderItem={(participant) => (
                    <List.Item key={participant.quizId}>
                        <Card title={participant.quizName} variant="borderless">

                            <Button type="primary">
                                <Link to={`${participant.quizId}`}>Monitor</Link>
                            </Button>
                        </Card>
                    </List.Item>
                )}
            />}
        </div>
    );
};

export default AdminQuizMonitor;