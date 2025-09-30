import {QuizAccess} from "./QuizAccess.ts";

export interface QuizDto {
    id: number;
    name: string;
    description?: string;
    categoryId: number;
    creatorId: number;
    quizAccess: QuizAccess;
}