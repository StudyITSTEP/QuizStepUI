import {Alert, Button, Card, Form, Input, Radio, Select, Space} from "antd";
import {CloseOutlined} from '@ant-design/icons';
import {useState} from "react";
import {useCategoriesQuery} from "../api/categoryApiSlice.ts";
import type {Category} from "../entities/Category.ts";
import type {FullQuizDto} from "../dto/FullQuizDto.ts";
import {useCreateQuizMutation} from "../api/quizApiSlice.ts";
import {useAppSelector} from "../app/hooks.ts";
import {selectUser} from "../features/userSlice.ts";
import type {ApiResult} from "../types/ApiResult.ts";
import type {QuizDto} from "../dto/QuizDto.tsx";
import {useNavigate} from "react-router";

export function CreateQuizPage() {
    const [form] = Form.useForm();
    const [errors, setErrors] = useState<{ key: string, message: string }[]>([]);
    const {data: categories, isLoading: categoryLoading} = useCategoriesQuery();
    const [createQuiz, {isLoading}] = useCreateQuizMutation();
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();
    const categoryOptions = categories?.map((cat: Category) => ({
        key: cat.id,
        label: cat.name,
        value: cat.id,
    }))
    const onSubmit = async (dto: FullQuizDto) => {
        dto.creatorId = user.sub;
        const result: ApiResult<QuizDto> = await createQuiz(dto)
        if (result.data?.succeeded) {
            navigate("/laboratory");
        }
    }
    return (
        <Form onFinish={onSubmit} form={form} labelCol={{span: 24}}>
            <Space direction="vertical" style={{width: '100%'}}>
                <Form.Item name={"name"} rules={[{required: true, message: "Please enter quiz name"}]}
                           label={"Name"} style={{width: '20%'}}>
                    <Input placeholder={"Quiz Name"}/>
                </Form.Item>
                <Form.Item name={"description"} rules={[{required: true, message: "Please enter quiz description"}]}
                           label={"Description"} style={{width: '40%'}}>
                    <Input placeholder={"Quiz Description"}/>
                </Form.Item>

                <Form.Item name="categoryId" rules={[{required: true, message: ""}]} label={"Category"}
                           style={{width: '20%'}}>
                    <Select loading={categoryLoading} options={categoryOptions}
                            placeholder={"Chose category"}></Select>
                </Form.Item>

                <Form.List name="questions" rules={[{
                    validator: async (_, items) => {
                        if (!items || items.length < 1) {
                            setErrors([...errors, {key: "questions", message: "At least one question is require"}]);
                        } else {
                            const err = errors.filter((x) => x.key !== "questions");
                            setErrors(err)
                        }
                    }
                }]}>
                    {(fields, {add, remove}) => (
                        <div style={{display: 'flex', rowGap: 16, flexDirection: 'column'}}>
                            {fields.map(field => {
                                return (
                                    <Card
                                        size="small"
                                        title={`Question ${field.name + 1}`}
                                        key={field.key}
                                        extra={
                                            <CloseOutlined
                                                onClick={() => {
                                                    remove(field.name);
                                                }}
                                            />
                                        }
                                    >
                                        <Form.Item label="Name" name={[field.name, 'text']}
                                                   rules={[{required: true, message: "Question is require"}]}>
                                            <Input/>
                                        </Form.Item>

                                        {/* Nest Form.List for answers */}
                                        <Form.Item label="Answer">
                                            <Form.List name={[field.name, 'answers']} rules={[{
                                                validator: async (_, items) => {
                                                    if (!items || items.length < 1) {
                                                        setErrors([...errors, {
                                                            key: "answers",
                                                            message: "At least two answers are require"
                                                        }]);
                                                    } else {
                                                        const err = errors.filter((x) => x.key !== "answers");
                                                        setErrors(err)
                                                    }
                                                }
                                            }]}>
                                                {(subFields, subOpt) => (
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        rowGap: 16
                                                    }}>
                                                        <Radio.Group
                                                            onChange={(e) => {
                                                                // Update the correct field when a radio button is selected
                                                                subFields.forEach((_, index) => {
                                                                    if (index === e.target.value) {
                                                                        form.setFieldValue(["questions", field.name, "correctAnswerIndex"], e.target.value)

                                                                    }
                                                                });
                                                            }}
                                                        >
                                                            {subFields.map((subField, idx) => (
                                                                <Space key={subField.key}>
                                                                    <Form.Item noStyle
                                                                               name={[subField.name, 'text']}
                                                                               rules={[{
                                                                                   required: true,
                                                                                   message: ""
                                                                               }]}>
                                                                        <Input placeholder="Your answer"
                                                                               addonBefore={
                                                                                   <CloseOutlined
                                                                                       onClick={() => {
                                                                                           subOpt.remove(subField.name);
                                                                                       }}

                                                                                   />
                                                                               }/>
                                                                    </Form.Item>
                                                                    <Form.Item
                                                                        noStyle>
                                                                        <Radio value={idx}>Correct</Radio>

                                                                    </Form.Item>
                                                                </Space>
                                                            ))}
                                                        </Radio.Group>
                                                        <Button type="dashed" onClick={() => subOpt.add()} block>
                                                            + Add Answer
                                                        </Button>
                                                    </div>
                                                )}
                                            </Form.List>
                                        </Form.Item>
                                        {/* Correct field to store the index of the correct answer */}
                                        <Form.Item name={[field.name, 'correctAnswerIndex']} hidden>
                                            <Input type="hidden"/>
                                        </Form.Item>
                                    </Card>
                                )
                            })}
                            <Button type="dashed" onClick={() => add()} block>
                                + Add Question
                            </Button>
                        </div>
                    )}
                </Form.List>


                <Form.Item name={"quizAccess"} rules={[{required: true, message: ""}]} label={"Access"}
                           style={{width: '20%'}}>
                    <Select placeholder={"Quiz Access"}
                            options={[{value: 0, label: "Public Access"}, {value: 1, label: "Private Access"}]}/>
                </Form.Item>

                {errors.length > 0 && (
                    <Alert message={errors[errors.length - 1].message} type="error" showIcon
                           style={{width: "fit-content"}}/>

                )}

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" onClick={() => {
                        setErrors([]);
                    }} loading={isLoading}>
                        Submit
                    </Button>
                </Form.Item>
            </Space>
        </Form>
    );
}