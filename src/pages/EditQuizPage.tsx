import {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router";
import { Button, Form, Input, Select, Typography, Spin, Card, Radio, Space } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useCategoriesQuery } from "../api/categoryApiSlice.ts";
import {
    useGetMyQuizzesQuery,
    useGetQuizByIdMutation,
    useUpdateQuizMutation
} from "../api/quizApiSlice.ts";
import type { FullQuizDto } from "../dto/FullQuizDto.ts";
import type { ApiResult } from "../types/ApiResult.ts";
import {selectUser} from "../features/userSlice.ts";
import {useAppSelector} from "../app/hooks.ts";

const { Title } = Typography;

export function EditQuizPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const user = useAppSelector(selectUser);
    const { data: categories } = useCategoriesQuery();
    const [getQuiz, {isLoading}] = useGetQuizByIdMutation();
    const [updateQuiz, { isLoading: saving }] = useUpdateQuizMutation();
    const [quiz, setQuiz] = useState<FullQuizDto>();
    const {refetch} = useGetMyQuizzesQuery(user.sub)

    useEffect(() => {
        const func = async () => {
            const result: ApiResult<FullQuizDto> = await getQuiz({id: +id!, accessCode: null});
            if (result?.data?.succeeded && result.data.value) {
                form.setFieldsValue(result.data.value);
                setQuiz(result.data.value);
            }
        }
        func()
    }, [form, getQuiz, id, refetch]);

    const categoryOptions = categories?.map((c) => ({
        key: c.id,
        label: c.name,
        value: c.id,
    }));

    const onSubmit = async (dto: FullQuizDto) => {
        dto.id = Number(id);
        const result: ApiResult<FullQuizDto> = await updateQuiz(dto);
        if (result.data?.succeeded) {
            refetch()
            navigate("/laboratory");
        }
    };

    if (isLoading) return <Spin size="large" style={{ marginTop: 100, display: "block" }} />;

    return (
        <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
            <Title level={2}>Edit Quiz</Title>
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Form.Item name="name" label="Quiz Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
                    <Select options={categoryOptions} />
                </Form.Item>
                <Form.Item hidden name={"creatorId"}>
                    <Input value={quiz?.creatorId} />
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
                                                                <Radio value={idx} checked={false}>Correct</Radio>
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
                                        initialValue={quiz?.questions?.[field.name]?.correctAnswerIndex ?? 0}
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

                <Form.Item name="quizAccess" label="Access" rules={[{ required: true }]}>
                    <Select
                        options={[
                            { value: 0, label: "Public" },
                            { value: 1, label: "Private" },
                        ]}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={saving}>
                        Save Changes
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}