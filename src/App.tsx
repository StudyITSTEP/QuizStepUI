import './App.css'
import {LoginPage} from "./pages/LoginPage.tsx";
import {HomePage} from "./pages/HomePage.tsx";
import {Route, Routes} from "react-router";
import {Layout} from "./components/Layout.tsx";
import {RequireAuthentication} from './components/RequireAuthentication.tsx';
import {LaboratoryPage} from "./pages/LaboratoryPage.tsx";
import {CategoryPage} from "./pages/CategoryPage.tsx";
import {MyQuizzesPage} from "./pages/MyQuizzesPage.tsx";
import {CreateQuizPage} from "./pages/CreateQuizPage.tsx";
import {QuizDetailsPage} from "./pages/QuizDetailsPage.tsx";
import QuizTakePage from "./pages/QuizTakePage.tsx";
import QuizResultList from "./components/QuizResultList.tsx";
import AdminQuizMonitor from "./components/AdminQuizMonitor.tsx";
import AdminPanel from "./components/AdminPanel.tsx";
import {RequireAuthorization} from "./components/RequireAuthorization.tsx";
import {MonitorCurrentQuizPage} from "./pages/MonitorCurrentQuizPage.tsx";
import {QuizResultPage} from "./pages/QuizResultPage.tsx";
import {UserPage} from "./pages/UserPage.tsx";


function App() {


    return (
        <>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    {/* public routes */}
                    <Route path="login" element={<LoginPage/>}/>

                    {/* protected routes */}
                    <Route element={<RequireAuthentication/>}>
                        <Route path="/home" element={<HomePage/>}/>
                        <Route path="/user/:userId" element={<UserPage />}/>
                        <Route element={<RequireAuthorization allowedRoles={["Admin"]}/>}>
                            <Route path="/admin" element={<AdminPanel/>}/>
                        </Route>
                        <Route path="/quiz/:quizId" element={<QuizDetailsPage/>}/>
                        <Route path="/quiz/start/:quizId" element={<QuizTakePage/>}/>
                        <Route path="/laboratory" element={<LaboratoryPage/>}>
                            {/* nested route */}
                            <Route index element={<MyQuizzesPage/>}/>
                            <Route element={<RequireAuthorization allowedRoles={["Admin", "Moderator"]}/>}>
                                <Route path="categories" element={<CategoryPage/>}/>
                            </Route>
                            <Route path="results" element={<QuizResultList/>}/>
                            <Route path="results/quiz/:quizId" element={<QuizResultPage/>}/>
                            <Route path="monitoring" element={<AdminQuizMonitor />}/>
                                <Route path="monitoring/:quizId" element={<MonitorCurrentQuizPage/>}/>

                            <Route path="quizzes/new" element={<CreateQuizPage/>}/>
                            <Route path="quiz/edit/:id" element={<CategoryPage/>}/>
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </>
    )
}

export default App
