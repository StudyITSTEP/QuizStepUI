import {useEffect, useLayoutEffect, useState} from "react";
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
    Spin, Result, Alert,
} from "antd";
import {Link, useParams} from "react-router";
import type {FullQuizDto} from "../dto/FullQuizDto.ts";
import type {Result as MyResult, ApiResult} from "../types/ApiResult.ts";
import {useGetQuizByIdMutation, useGetQuizDetailsQuery} from "../api/quizApiSlice.ts";
import type {SetQuizResultDto} from "../dto/SetQuizResultDto.ts";
import {
    useGetResultByQuizMutation,
    useGetUserResultsQuery,
    useSubmitResultMutation
} from "../api/quizResultApiSlice.ts";
import {useAppSelector} from "../app/hooks.ts";
import {selectUser} from "../features/userSlice.ts";
import type {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import type {QuizResultDto} from "../dto/QuizResultDto.ts";
import * as signalR from "@microsoft/signalr";

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
    const [submitResult, {isLoading: submitResultLoading}] = useSubmitResultMutation();
    const [quizResult] = useGetResultByQuizMutation();
    const [retake, setRetake] = useState<number>(-1);
    const user = useAppSelector(selectUser);
    const {refetch: refetchQuizResults} = useGetUserResultsQuery(user.sub);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    const apiUrl = "http://localhost:5207/api/";

    // Load quiz after entering access code
    const fetchQuiz = async () => {
        if (!quizId) return;
        const result: ApiResult<FullQuizDto> = await getQuiz({id: +quizId, accessCode: code});
        console.log(result);

        if (result?.data?.succeeded) {
            setQuiz(result.data.value!);
            setShowAccessCode(false);
        } else {
            setErrors({...errors, ["access"]: "Code is Not Correct!"});
        }
    };

    // Handle selecting an answer
    const handleSelect = (answerId: number) => {
        setCurrentAnswer(answerId);
    };

    // Move to next question or finish
    const handleNext = async () => {
        if (!quiz || currentAnswer == null) return;

        setAnswerStore((prev) => [
            ...prev,
            { questionId: quiz.questions[current].id!, answerId: currentAnswer }
        ]);
        setCurrentAnswer(null);



        if (current < quiz.questions.length - 1) {
            setCurrent(current + 1);
            if (connection) {

                await connection.invoke("SetCurrentQuestion", user.sub, quiz.id, current + 1);
            }
        } else {
            const dto: SetQuizResultDto = {
                quizId: quiz.id!,
                userId: user.sub,
                answerQuestions: [
                    ...answerStore,
                    { questionId: quiz.questions[current].id!, answerId: currentAnswer }
                ]
            };

            const result = await submitResult(dto);
            refetchQuizResults();
            if (result?.data?.succeeded) {
                setCompleted(true);
            }

        }

    };

    useLayoutEffect(() => {
        const func = async () => {
            if (quizDetails?.value && user) {
                try {
                    const result: MyResult<QuizResultDto> = await quizResult({
                        quizId: quizDetails.value.id!,
                        userId: user.sub
                    }).unwrap();
                    if (result?.succeeded && result.value) {
                        setRetake(result.value.score!)
                    }
                } catch (err) {
                    const error = err as FetchBaseQueryError;
                    if (error.status === 404) {
                        setRetake(-1)
                    }
                }
            }
        }
        func();
    }, [quizDetails, user, quizResult]);

    useEffect(() => {
        if (!quizId || !user) return;
        console.log(apiUrl)
        const conn = new signalR.HubConnectionBuilder()
            .withUrl(apiUrl + `activeUserHub?quizId=${quizId}&userId=${user.sub}`, {
                withCredentials: false,
            })
            .build();

        conn.start().then(() => {
            console.log("Connected to SignalR");
        });

        setConnection(conn);

        return async () => {
            await conn.stop();
        };
    }, [quizId, user]);

    return (
        <>

            <Modal open={completed} footer={null} closable={false}>
                <Result status={"success"} title={"Successfully Completed Test"}
                        extra={[
                            <Button type={"primary"} loading={submitResultLoading}>
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
                            {retake >= 0 &&
                                <Statistic
                                    title="Previous Result"
                                    value={retake}
                                    suffix={" / 100"}
                                />}

                            {quizDetails?.value?.access === 1 ? (
                                <>
                                    <Title level={4} style={{marginTop: 16}}>
                                        Enter Access Code
                                    </Title>
                                    <Text type="secondary" style={{marginBottom: 12}}>
                                        Please enter the 6-digit access code to continue.
                                    </Text>
                                    {errors["access"] &&
                                        <Alert message={errors["access"]} type={"error"}/>}
                                    <Input.OTP
                                        length={5}
                                        onChange={(e) => setCode(e)}
                                        style={{marginBottom: 16}}
                                    />

                                    <Button type="primary" block size="large" onClick={fetchQuiz}
                                            disabled={!(code.length === 5)}>
                                        {retake >= 0 ? <>Try again</> : <>Submit</>}
                                    </Button>
                                </>
                            ) : (
                                <Button type="primary" block size="large" onClick={fetchQuiz} loading={detailsLoading}>
                                    {retake >= 0 ? <>Try again</> : <>Submit</>}
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
