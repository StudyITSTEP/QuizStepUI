import {QuizAccess} from "./QuizAccess.tsx";

export type MyQuizDto = {
    id: number;
    name: string;
    description?: string;
    categoryId: number;
    creatorId: number;
    quizAccess: QuizAccess;
}