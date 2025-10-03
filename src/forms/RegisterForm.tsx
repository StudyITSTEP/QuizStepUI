import {useRegisterMutation} from "../api/accountApiSlice.ts";
import {Button, Form, Input, Modal} from "antd";
import type {RegisterDto} from "../dto/registerDto.ts";
import type {ApiResult} from "../types/ApiResult.ts";
import {useState} from "react";
import {useNavigate} from "react-router";

//TODO:
/*
* 1. Error handling: Unauthorized, invalid form
*
* */

export function RegisterForm() {
    const [register, { isLoading }] = useRegisterMutation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (data: RegisterDto) => {
        const result: ApiResult<unknown> = await register(data);

        if (result?.data?.succeeded) {
            setUserEmail(data.email);
            setIsModalVisible(true);
        }
    };

    const handleOk = async () => {
        try {
            Modal.success({
                title: "Email confirmation sent!",
                content: "Please check your email to confirm registration.",
                onOk: () => navigate("/login"),
            });

            setIsModalVisible(false);
        } catch (err) {
            Modal.error({
                title: "Error",
                content: "Failed to send confirmation email.",
            });
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Form name={"register"}
                  labelCol={{span: 24}}
                  wrapperCol={{span: 24}}
                  onFinish={onSubmit}
            >
                <Form.Item label="First Name"
                           name={"firstName"}
                           rules={[{required: true, message: "Please input your first name"}]}>
                    <Input/>
                </Form.Item>

                <Form.Item label="Last Name"
                           name={"lastName"}
                           rules={[{required: true, message: "Please input your last name"}]}>
                    <Input/>
                </Form.Item>

                <Form.Item label="Email"
                           name={"email"}
                           rules={[{required: true, message: "Please input your email"}, {
                               type: 'email',
                               message: 'The input is not valid E-mail!',
                           },]}>
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new password that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>

            <Modal
                title="Thank you for registering!"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Ok"
            >
                <p>Your registration was successful. Click "Ok" to receive a confirmation email.</p>
            </Modal>
        </>
    )
}