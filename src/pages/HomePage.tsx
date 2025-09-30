import {useAppSelector} from "../app/hooks.ts";
import {selectUser} from "../features/userSlice.ts";
import type {QuizDto} from "../dto/QuizDto.tsx";
import QuizCatalog from "../components/QuizCatalog.tsx";

const quizzes: QuizDto[] = [
    {
        id: 1,
        name: "Основы C#",
        description: "Базовые концепции языка.",
        categoryId: 101,
        creatorId: 42,
        quizAccess: 0,
    },
    {
        id: 2,
        name: "Java Advanced",
        description: "Stream API, многопоточность и JVM.",
        categoryId: 102,
        creatorId: 99,
        quizAccess: 0,
    },
    {
        id: 3,
        name: "JavaScript Fundamentals",
        description: "ES6+, async/await, DOM API.",
        categoryId: 103,
        creatorId: 88,
        quizAccess: 0,
    },
    {
        id: 4,
        name: "JavaScript Fundamentals",
        description: "ES6+, async/await, DOM API.",
        categoryId: 103,
        creatorId: 88,
        quizAccess: 1,
    },{
        id: 5,
        name: "JavaScript Fundamentals",
        description: "ES6+, async/await, DOM API.",
        categoryId: 103,
        creatorId: 88,
        quizAccess: 0,
    },
    {
        id: 6,
        name: "JavaScript Fundamentals",
        description: "ES6+, async/await, DOM API.",
        categoryId: 103,
        creatorId: 88,
        quizAccess: 1,
    },
    {
        id: 7,
        name: "JavaScript Fundamentals",
        description: "ES6+, async/await, DOM API.",
        categoryId: 103,
        creatorId: 88,
        quizAccess: 1,
    },
];

const handleStart = (quizId: number) => {
    alert(`Стартуем тест с id=${quizId}`);
};

export function HomePage() {
    const user = useAppSelector(selectUser);

    return (
        <>

            <h1>Welcome To Home Page {user.firstName} {user.lastName}!</h1>
            <QuizCatalog quizzes={quizzes} onStart={handleStart} />

        </>
    )
}