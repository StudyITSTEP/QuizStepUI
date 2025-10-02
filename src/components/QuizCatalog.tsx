import React, {useState} from "react";
import {Row, Col, Pagination} from 'antd';
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
        <div>
            <Row gutter={[16, 16]}>
                {paginated.map((quiz) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={quiz.id}>
                        <QuizCard quiz={quiz} onStart={onStart} />
                    </Col>
                ))}
            </Row>

            <Pagination
                style={{ marginTop: 20, textAlign: "center" }}
                current={currentPage}
                pageSize={pageSize}
                total={quizzes.length}
                onChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default QuizCatalog;