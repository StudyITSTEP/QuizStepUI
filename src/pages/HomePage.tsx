import {useAppSelector} from "../app/hooks.ts";
import {selectUser} from "../features/userSlice.ts";
import QuizCatalog from "../components/QuizCatalog.tsx";
import {useGetAllQuizzesQuery} from "../api/quizApiSlice.ts";


export function HomePage() {
    const user = useAppSelector(selectUser);
    const {data: quizzes} = useGetAllQuizzesQuery();
    const onQuizDetails = async (id: number) => {

    }

    return (
        <>

            <h1>Welcome To Home Page {user.firstName} {user.lastName}!</h1>
            <QuizCatalog quizzes={quizzes ?? []} onStart={(s) => onQuizDetails(s)} />

        </>
    )
}