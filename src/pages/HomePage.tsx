import QuizCatalog from "../components/QuizCatalog.tsx";
import {useGetAllQuizzesQuery} from "../api/quizApiSlice.ts";
import {Layout, Spin, Typography} from "antd";

const {Content} = Layout;
const {Title} = Typography;

export function HomePage() {
    const {data: quizzes, isLoading} = useGetAllQuizzesQuery();

    return (
        <Layout style={{minHeight: "90vh", background: "#f5f5f5"}}>
            <Content style={{padding: "40px 24px"}}>
                <div style={{maxWidth: 1200, margin: "0 auto"}}>
                    <Title level={2} style={{textAlign: "center", marginBottom: 32}}>
                        Quizzes Available
                    </Title>
                    {isLoading ? <Spin fullscreen/>
                        :
                        <QuizCatalog
                            quizzes={quizzes ?? []}
                            onStart={() => console.log("Start quiz")}
                        />}
                </div>
            </Content>
        </Layout>
    );
}
