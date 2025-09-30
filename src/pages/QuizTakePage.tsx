import React, {useState} from 'react';
import { Card, Radio, Button, Progress, Typography} from "antd";
import type {QuestionDto} from "../dto/QuestionDto.ts";
import type {AnswerDto} from "../dto/AnswerDto.ts";

const {Title, Paragraph} = Typography;

interface QuizTakePageProps {
    quizName: string;
    questions: QuestionDto[];
    onSubmit: (answers: Record<number, number>) => void;
}

const QuizTakePage: React.FC<QuizTakePageProps> = ({ quizName, questions, onSubmit }) => {
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});

    const question = questions[current];
    const total = questions.length;

    const handleSelect = (questionId: number, answerId: number) => {
        setAnswers({ ...answers, [questionId]: answerId });
    };

    const handleNext = () => {
        if (current < total - 1) {
            setCurrent(current + 1);
        } else {
            onSubmit(answers);
        }
    };

    return (
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <Card>
                <Title level={3} style={{ marginBottom: 20 }}>
                    {quizName}
                </Title>

                <Progress
                    percent={Math.round(((current + 1) / total) * 100)}
                    style={{ marginBottom: 20 }}
                />

                <Title level={4}>
                    Вопрос {current + 1} из {total}
                </Title>
                <Paragraph>{question.text}</Paragraph>

                <Radio.Group
                    onChange={(e) => handleSelect(question.id, e.target.value)}
                    value={answers[question.id]}
                    style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                    {question.answers.map((a: AnswerDto) => (
                        <Radio key={a.id} value={a.id}>
                            {a.text}
                        </Radio>
                    ))}
                </Radio.Group>

                <div style={{ marginTop: 20, textAlign: "right" }}>
                    <Button
                        type="primary"
                        onClick={handleNext}
                        disabled={!answers[question.id]}
                    >
                        {current < total - 1 ? "Далее" : "Завершить"}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default QuizTakePage;