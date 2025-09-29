import {QuizAccess} from "./QuizAccess.tsx";

export interface QuizDto {
    id: number;
    name: string;
    description?: string;
    categoryId: number;
    creatorId: number;
    quizAccess: QuizAccess;
}