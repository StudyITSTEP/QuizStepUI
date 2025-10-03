import React, {useState} from "react";
import {Row, Col, Pagination} from "antd";
import QuizCard from "./QuizCard";
import type {QuizDetailsDto} from "../dto/QuizDetailsDto.ts";

interface QuizCatalogProps {
    quizzes: QuizDetailsDto[];
    pageSize?: number;
    onStart: (quizId: number) => void;
}

const QuizCatalog: React.FC<QuizCatalogProps> = ({
                                                     quizzes,
                                                     pageSize = 6,
                                                     onStart,
                                                 }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * pageSize;
    const paginated = quizzes.slice(startIndex, startIndex + pageSize);

    return (
        <div style={{padding: "24px 0"}}>
            <Row gutter={[24, 24]} justify="center">
                {paginated.map((quiz) => (
                    <Col lg={8} key={quiz.id}>
                        <div style={{height: "100%"}}>
                            <QuizCard quiz={quiz} onStart={onStart}/>
                        </div>
                    </Col>
                ))}
            </Row>

            <Pagination
                style={{marginTop: 32, textAlign: "center"}}
                current={currentPage}
                pageSize={pageSize}
                total={quizzes.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
            />
        </div>
    );
};

export default QuizCatalog;
