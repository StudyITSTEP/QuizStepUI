import type {Question} from "../entities/Question.ts";
import type {QuizAccess} from "./QuizAccess.tsx";

export type FullQuizDto = {
    id?: number | null,
    name: string,
    description: string,
    categoryId: number,
    creatorId: string,
    questions: Question[],
    quizAccess: QuizAccess,
}