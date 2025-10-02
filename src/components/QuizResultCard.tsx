import React from "react";
import { Card, Progress, Space, Typography, Flex } from "antd";
import type { QuizResultDto } from "../dto/QuizResultDto.ts";
import { useGetQuizDetailsQuery } from "../api/quizApiSlice.ts";
import { Link } from "react-router";

const { Title, Text } = Typography;

interface QuizResultCardProps {
    result: QuizResultDto;
}

const QuizResultCard: React.FC<QuizResultCardProps> = ({ result }) => {
    const { data, isLoading } = useGetQuizDetailsQuery(Number(result.quizId));
    const quiz = data?.value;

    return (
        <>
            {!isLoading && quiz && (
                <Card
                    hoverable
                    style={{ width: 350, margin: "1rem auto", borderRadius: 8 }}
                    title={<Title level={4} style={{ margin: 0 }}>{quiz.name}</Title>}
                >
                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                        <Space align="center">
                            <Text strong>Creator:</Text>
                            <Typography.Link>
                                <Link to={`/user/${quiz.creatorId}`}>{quiz.creatorEmail}</Link>
                            </Typography.Link>
                        </Space>

                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Text strong>Score</Text>
                            <Flex align="center" gap="small">
                                <Text style={{ minWidth: 60, fontWeight: 600 }}>
                                    {result.score}/100
                                </Text>
                                <Progress
                                    percent={Number(result.score)}
                                    status={result.score >= 50 ? "success" : "exception"}
                                    style={{ flex: 1 }}
                                />
                            </Flex>
                        </Space>
                    </Space>
                </Card>
            )}
        </>
    );
};

export default QuizResultCard;
