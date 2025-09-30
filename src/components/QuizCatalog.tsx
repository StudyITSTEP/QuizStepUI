import React, {useState} from "react";
import {Row, Col, Pagination} from 'antd';
import QuizCard from "./QuizCard";
import type {QuizDto} from "../dto/QuizDto.ts";
import {QuizAccess} from "../dto/QuizAccess.ts";

interface QuizCatalogProps {
    quizzes: QuizDto[];
    pageSize?: number;
    onStart: (quizId: number) => void;
}

const QuizCatalog: React.FC<QuizCatalogProps> = ({
                                                      quizzes,
                                                      pageSize = 6,
                                                      onStart,
                                                  }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const publicQuizzes = quizzes.filter(
        (q) => q.quizAccess === QuizAccess.Public
    );

    const startIndex = (currentPage - 1) * pageSize;
    const paginated = publicQuizzes.slice(startIndex, startIndex + pageSize);

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
                total={publicQuizzes.length}
                onChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default QuizCatalog;