import {useRegisterMutation} from "../api/accountApiSlice.ts";
import {Button, Form, Input} from "antd";
import type {RegisterDto} from "../dto/registerDto.ts";
import type {ApiResult} from "../types/ApiResult.ts";

//TODO:
/*
* 1. Error handling: Unauthorized, invalid form
*
* */

export function RegisterForm() {
    const [register, {isLoading}] = useRegisterMutation();
    const onSubmit = async (data: RegisterDto) => {
        const result: ApiResult<unknown> = await register(data)
        console.log(result)
        if (result.data?.success){
        }
    }
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
        </>
    )
}