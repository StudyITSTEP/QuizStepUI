export type SetQuizResultDto = {
    userId: string;
    quizId: number;
    answerQuestions: {
        questionId: number,
        answerId: number,
    }[],
}