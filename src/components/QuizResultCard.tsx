import React from "react";
import { Card, Progress, Space, Typography, Flex, Avatar, Tag } from "antd";
import type { QuizResultDto } from "../dto/QuizResultDto.ts";
import { useGetQuizDetailsQuery } from "../api/quizApiSlice.ts";
import { Link } from "react-router";
import { useGetUserDetailsQuery } from "../api/userApiSplice.ts";

const { Title, Text } = Typography;

interface QuizResultCardProps {
    result: QuizResultDto;
}

const QuizResultCard: React.FC<QuizResultCardProps> = ({ result }) => {
    const { data, isLoading } = useGetQuizDetailsQuery(Number(result.quizId));
    const { data: userDetails, isLoading: userDetailsLoading } = useGetUserDetailsQuery(result.userId);
    const quiz = data?.value;

    if (isLoading || userDetailsLoading || !quiz || !userDetails) return null;

    const fullName = `${userDetails.firstName} ${userDetails.lastName}`;
    const passed = result.score >= 50;

    return (
        <Card
            hoverable
            style={{
                width: 360,
                minHeight: 250,
                margin: "1rem auto",
                borderRadius: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            {/* User Info */}
            <Space align="center" style={{ marginBottom: 12 }}>
                <Avatar size={48} style={{ backgroundColor: passed ? "#87d068" : "#f5222d" }}>
                    {userDetails.firstName?.[0]}
                </Avatar>
                <div>
                    <Title level={5} style={{ margin: 0 }}>
                        <Link to={`/user/${userDetails.id}`}>{fullName}</Link>
                    </Title>
                    <Text type="secondary">{userDetails.email}</Text>
                </div>
            </Space>

            {/* Quiz Info */}
            <div style={{ marginBottom: 12 }}>
                <Text strong>Quiz:</Text>{" "}
                <Link to={`/quiz/${quiz.id}`}>
                    <Text underline>{quiz.name}</Text>
                </Link>
                <br />
                <Text type="secondary">
                    Creator: <Link to={`/user/${quiz.creatorId}`}>{quiz.creatorEmail}</Link>
                </Text>
            </div>

            {/* Score */}
            <div>
                <Flex align="center" gap="small" style={{ marginBottom: 8 }}>
                    <Text strong style={{ minWidth: 70 }}>
                        Score:
                    </Text>
                    <Text style={{ fontWeight: 600 }}>{result.score}/100</Text>
                    <Tag color={passed ? "green" : "red"}>{passed ? "Passed" : "Failed"}</Tag>
                </Flex>
                <Progress
                    percent={Number(result.score)}
                    status={passed ? "success" : "exception"}
                />
            </div>
        </Card>
    );
};

export default QuizResultCard;
