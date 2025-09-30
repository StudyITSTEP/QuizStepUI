import type {Answer} from "./Answer.ts";

export type Question = {
    id: number | null,
    text: string,
    answers: Answer[],
    correctAnswerIndex: number,
}