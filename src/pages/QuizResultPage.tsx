import {useParams} from "react-router";
import {useGetResultsByQuizIdQuery} from "../api/quizResultApiSlice.ts";
import QuizResultCard from "../components/QuizResultCard.tsx";

export function QuizResultPage() {
    const {quizId} = useParams()
    const {data: results} = useGetResultsByQuizIdQuery(quizId!)

    return <>
        {results && results.map((result) => {
            return <QuizResultCard result={result}/>
        })}
    </>
}