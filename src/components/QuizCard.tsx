import React from "react";
import { Card, Button, Tag, Typography } from "antd";
import { QuizAccess } from "../dto/QuizAccess.ts";
import { Link } from "react-router";
import type { QuizDetailsDto } from "../dto/QuizDetailsDto.ts";
import { useCategoriesQuery } from "../api/categoryApiSlice.ts";

const { Paragraph, Text } = Typography;

interface QuizCardProps {
    quiz: QuizDetailsDto;
    onStart: (quizId: number) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStart }) => {
    const { data: categories } = useCategoriesQuery();

    const categoryName = categories?.find(c => c.id === quiz.categoryId)?.name || "Uncategorized";

    return (
        <Card
            title={
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Typography.Title level={5}>{quiz.name}</Typography.Title>
                    <Tag color="blue" style={{ fontSize: 16, padding: "4px 4px", width: "fit-content", marginBottom: 10 }}>
                        {categoryName}
                    </Tag>
                </div>
            }
            extra={
                <Tag color={quiz.access === QuizAccess.Public ? "green" : "red"} >
                    {quiz.access === QuizAccess.Public ? "Public" : "Private"}
                </Tag>
            }
            hoverable
            style={{
                width: 320,
                minHeight: 260,
                borderRadius: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
            bodyStyle={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
            }}
        >
            <div style={{ flex: 1 }}>
                <Paragraph ellipsis={{ rows: 3 }}>
                    {quiz.description || <Text type="secondary">No description provided.</Text>}
                </Paragraph>
            </div>

            <div style={{ textAlign: "right" }}>
                <Link to={`/quiz/${quiz.id}`}>
                    <Button type="primary" onClick={() => onStart(quiz.id)}>
                        Details
                    </Button>
                </Link>
            </div>
        </Card>
    );
};

export default QuizCard;
