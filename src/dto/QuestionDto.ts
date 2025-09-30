import type {AnswerDto} from "./AnswerDto.ts";

export interface QuestionDto {
    id: number;
    text: string;
    quizId: number;
    answers: AnswerDto[];
}