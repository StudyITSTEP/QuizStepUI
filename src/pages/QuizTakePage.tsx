import {useState} from "react";
import {
    Card,
    Radio,
    Button,
    Progress,
    Typography,
    Flex,
    Input,
    Modal,
    Statistic,
    Space,
    Spin, Result,
} from "antd";
import {Link, useParams} from "react-router";
import type {FullQuizDto} from "../dto/FullQuizDto.ts";
import type {ApiResult} from "../types/ApiResult.ts";
import {useGetQuizByIdMutation, useGetQuizDetailsQuery} from "../api/quizApiSlice.ts";

const {Title, Paragraph, Text} = Typography;

type AnswerRecord = { questionId: number; answerId: number };

const QuizTakePage = () => {
    const {quizId} = useParams();

    const [current, setCurrent] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState<number | null>(null);
    const [answerStore, setAnswerStore] = useState<AnswerRecord[]>([]);
    const [quiz, setQuiz] = useState<FullQuizDto | null>(null);
    const [showAccessCode, setShowAccessCode] = useState(true);
    const [code, setCode] = useState("");
    const [completed, setCompleted] = useState<boolean>(false);
    const [getQuiz, {isLoading}] = useGetQuizByIdMutation();
    const {data: quizDetails, isLoading: detailsLoading} = useGetQuizDetailsQuery(+quizId!);

    // Load quiz after entering access code
    const fetchQuiz = async () => {
        if (!quizId) return;

        const result: ApiResult<FullQuizDto> = await getQuiz({id: +quizId, code});
        if (result?.data?.succeeded) {
            setQuiz(result.data.value!);
            setShowAccessCode(false);
        }
    };

    // Handle selecting an answer
    const handleSelect = (answerId: number) => {
        setCurrentAnswer(answerId);
    };

    // Move to next question or finish
    const handleNext = () => {
        if (!quiz || currentAnswer == null) return;

        setAnswerStore((prev) => [...prev, {questionId: quiz.questions[current].id!, answerId: currentAnswer}]);
        setCurrentAnswer(null);

        if (current < quiz.questions.length - 1) {
            setCurrent(current + 1);
        } else {
            console.log("Quiz finished! All answers:", [
                ...answerStore,
                {questionId: quiz.questions[current].id!, answerId: currentAnswer},
            ]);
            // TODO: submit answers to API
            setCompleted(true);
        }
    };

    return (
        <>

            <Modal open={completed} footer={null} closable={false}>
                <Result status={"success"} title={"Successfully Completed Test"}
                        extra={[
                            <Button type={"primary"}>
                                <Link to={"/laboratory/results"}>
                                    Check Results
                                </Link>
                            </Button>
                        ]}
                />
            </Modal>

            {/* Access Code Modal */}
            <Modal open={showAccessCode} footer={null} centered closable={false}>
                <Flex vertical align="center" style={{padding: 24}} gap={16}>
                    {detailsLoading ? (
                        <Spin/>
                    ) : (
                        <>
                            <Title level={3}>{quizDetails?.value?.name}</Title>
                            <Text type="secondary">{quizDetails?.value?.description}</Text>
                            <Statistic
                                title="Total Questions"
                                value={quizDetails?.value?.totalQuestions || "No Questions"}
                            />

                            {quizDetails?.value?.access === 1 ? (
                                <>
                                    <Title level={4} style={{marginTop: 16}}>
                                        Enter Access Code
                                    </Title>
                                    <Text type="secondary" style={{marginBottom: 12}}>
                                        Please enter the 6-digit access code to continue.
                                    </Text>
                                    <Input.OTP
                                        length={6}
                                        onChange={setCode}
                                        style={{marginBottom: 16}}
                                    />
                                    <Button type="primary" block size="large" onClick={fetchQuiz}>
                                        Submit
                                    </Button>
                                </>
                            ) : (
                                <Button type="primary" block size="large" onClick={fetchQuiz} loading={detailsLoading}>
                                    Start Quiz
                                </Button>
                            )}
                        </>
                    )}
                </Flex>
            </Modal>

            {/* Quiz Content */}
            {!isLoading && quiz?.questions?.length ? (
                <div style={{maxWidth: 700, margin: "0 auto"}}>
                    <Card>
                        <Space direction="vertical" size="large" style={{width: "100%"}}>
                            <Title level={3} style={{textAlign: "center"}}>
                                {quiz.name}
                            </Title>

                            {/* Progress */}
                            <Progress percent={Math.round(((current + 1) / quiz.questions.length) * 100)}/>

                            {/* Question */}
                            <div>
                                <Title level={4}>
                                    Question {current + 1} of {quiz.questions.length}
                                </Title>
                                <Paragraph>{quiz.questions[current].text}</Paragraph>
                            </div>

                            {/* Answers */}
                            <Radio.Group
                                value={currentAnswer}
                                onChange={(e) => handleSelect(e.target.value)}
                                options={quiz.questions[current].answers.map((a) => ({
                                    label: a.text,
                                    value: a.id!,
                                }))}
                                style={{display: "flex", flexDirection: "column", gap: 12}}
                            />

                            {/* Navigation */}
                            <Flex justify="end">
                                <Button
                                    type="primary"
                                    onClick={handleNext}
                                    disabled={currentAnswer == null}
                                >
                                    {current < quiz.questions.length - 1 ? "Next" : "Finish"}
                                </Button>
                            </Flex>
                        </Space>
                    </Card>
                </div>
            ) : null}
        </>
    );
};

export default QuizTakePage;
