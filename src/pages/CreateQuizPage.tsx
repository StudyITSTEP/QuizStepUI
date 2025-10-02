import {
    Alert,
    Button,
    Card,
    Form,
    Input,
    Radio,
    Select,
    Space,
    Typography,
} from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useCategoriesQuery } from "../api/categoryApiSlice.ts";
import type { Category } from "../entities/Category.ts";
import type { FullQuizDto } from "../dto/FullQuizDto.ts";
import {
    useCreateQuizMutation,
    useGetAllQuizzesQuery,
    useGetMyQuizzesQuery,
} from "../api/quizApiSlice.ts";
import { useAppSelector } from "../app/hooks.ts";
import { selectUser } from "../features/userSlice.ts";
import type { ApiResult } from "../types/ApiResult.ts";
import type { QuizDto } from "../dto/QuizDto.tsx";
import { useNavigate } from "react-router";

const { Title } = Typography;

export function CreateQuizPage() {
    const [form] = Form.useForm();
    const [errors, setErrors] = useState<{ key: string; message: string }[]>([]);
    const { data: categories, isLoading: categoryLoading } =
        useCategoriesQuery();
    const [createQuiz, { isLoading }] = useCreateQuizMutation();
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();

    const { refetch: refetchMyQuizzes } = useGetMyQuizzesQuery(user.sub);
    const { refetch: refetchAllQuizzes } = useGetAllQuizzesQuery();

    const categoryOptions = categories?.map((cat: Category) => ({
        key: cat.id,
        label: cat.name,
        value: cat.id,
    }));

    const onSubmit = async (dto: FullQuizDto) => {
        dto.creatorId = user.sub;
        const result: ApiResult<QuizDto> = await createQuiz(dto);
        if (result.data?.succeeded) {
            refetchMyQuizzes();
            refetchAllQuizzes();
            navigate("/laboratory");
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
            <Title level={2}>Create New Quiz</Title>

            <Form
                onFinish={onSubmit}
                form={form}
                layout="vertical"
                style={{ marginTop: "1.5rem" }}
            >
                <Form.Item
                    name="name"
                    label="Quiz Name"
                    rules={[{ required: true, message: "Please enter quiz name" }]}
                >
                    <Input placeholder="Enter quiz name" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: "Please enter quiz description" }]}
                >
                    <Input.TextArea
                        placeholder="Brief description of the quiz"
                        rows={3}
                    />
                </Form.Item>

                <Form.Item
                    name="categoryId"
                    label="Category"
                    rules={[{ required: true, message: "Please select a category" }]}
                >
                    <Select
                        loading={categoryLoading}
                        options={categoryOptions}
                        placeholder="Choose category"
                    />
                </Form.Item>

                <Form.List
                    name="questions"
                    rules={[
                        {
                            validator: async (_, items) => {
                                if (!items || items.length < 1) {
                                    return Promise.reject(
                                        new Error("At least one question is required")
                                    );
                                }
                            },
                        },
                    ]}
                >
                    {(fields, { add, remove }) => (
                        <Space direction="vertical" size="large" style={{ width: "100%" }}>
                            {fields.map((field, index) => (
                                <Card
                                    key={field.key}
                                    size="small"
                                    title={`Question ${index + 1}`}
                                    extra={
                                        <Button
                                            type="text"
                                            danger
                                            icon={<CloseOutlined />}
                                            onClick={() => remove(field.name)}
                                        />
                                    }
                                >
                                    <Form.Item
                                        name={[field.name, "text"]}
                                        label="Question Text"
                                        rules={[
                                            { required: true, message: "Please enter question text" },
                                        ]}
                                    >
                                        <Input placeholder="Type your question here" />
                                    </Form.Item>

                                    <Form.List
                                        name={[field.name, "answers"]}
                                        rules={[
                                            {
                                                validator: async (_, items) => {
                                                    if (!items || items.length < 2) {
                                                        return Promise.reject(
                                                            new Error("At least two answers are required")
                                                        );
                                                    }
                                                },
                                            },
                                        ]}
                                    >
                                        {(subFields, subOpt) => (
                                            <div>
                                                <Radio.Group
                                                    onChange={(e) =>
                                                        form.setFieldValue(
                                                            ["questions", field.name, "correctAnswerIndex"],
                                                            e.target.value
                                                        )
                                                    }
                                                    style={{ width: "100%" }}
                                                >
                                                    <Space
                                                        direction="vertical"
                                                        style={{ width: "100%" }}
                                                    >
                                                        {subFields.map((subField, idx) => (
                                                            <Space key={subField.key} align="center">
                                                                <Form.Item
                                                                    noStyle
                                                                    name={[subField.name, "text"]}
                                                                    rules={[
                                                                        {
                                                                            required: true,
                                                                            message: "Answer text is required",
                                                                        },
                                                                    ]}
                                                                >
                                                                    <Input
                                                                        placeholder={`Answer ${idx + 1}`}
                                                                        style={{ width: 300 }}
                                                                    />
                                                                </Form.Item>
                                                                <Radio value={idx}>Correct</Radio>
                                                                <Button
                                                                    type="text"
                                                                    danger
                                                                    icon={<CloseOutlined />}
                                                                    onClick={() => subOpt.remove(subField.name)}
                                                                />
                                                            </Space>
                                                        ))}
                                                    </Space>
                                                </Radio.Group>

                                                <Button
                                                    type="dashed"
                                                    onClick={() => subOpt.add()}
                                                    block
                                                    icon={<PlusOutlined />}
                                                    style={{ marginTop: 12 }}
                                                >
                                                    Add Answer
                                                </Button>
                                            </div>
                                        )}
                                    </Form.List>

                                    <Form.Item
                                        name={[field.name, "correctAnswerIndex"]}
                                        hidden
                                    >
                                        <Input type="hidden" />
                                    </Form.Item>
                                </Card>
                            ))}

                            <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                            >
                                Add Question
                            </Button>
                        </Space>
                    )}
                </Form.List>

                <Form.Item
                    name="quizAccess"
                    label="Access"
                    rules={[{ required: true, message: "Please select quiz access" }]}
                >
                    <Select
                        placeholder="Choose access level"
                        options={[
                            { value: 0, label: "Public Access" },
                            { value: 1, label: "Private Access" },
                        ]}
                    />
                </Form.Item>

                {errors.length > 0 && (
                    <Alert
                        message={errors[errors.length - 1].message}
                        type="error"
                        showIcon
                        style={{ width: "fit-content", marginBottom: "1rem" }}
                    />
                )}

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        onClick={() => setErrors([])}
                    >
                        Submit Quiz
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
