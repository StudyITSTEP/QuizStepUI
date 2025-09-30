import {useGetMyQuizzesQuery} from "../api/quizApiSlice.ts";
import {Link} from "react-router";
import {Button} from "antd";
import {MyQuizCard} from "../components/MyQuizCard.tsx";
import type {QuizDto} from "../dto/QuizDto.tsx";

export function MyQuizzesPage() {
    const {data} = useGetMyQuizzesQuery(undefined)
    return (
        <>
            <Button type={"primary"}>
                <Link to={`quizzes/new`}>New Quiz</Link>
            </Button>
            {data && data.map((quiz: QuizDto) => (
                <MyQuizCard {...quiz}/>
            ))}
        </>

    )
}