import {useLoginMutation} from "../api/accountApiSlice.ts";
import {useAppDispatch} from "../app/hooks.ts";
import type {LoginDto} from "../dto/loginDto.ts";
import {Button, Checkbox, Form, Input} from "antd";
import type {ApiResult} from "../types/ApiResult.ts";
import type {LoginResultDto} from "../dto/loginResultDto.ts";
import {setUser} from "../features/userSlice.ts";

//TODO:
/*
* 1. Error handling: Unauthorized, invalid form
*
* */

export function LoginForm() {
    const [login, {isLoading}] = useLoginMutation();
    const dispatch = useAppDispatch();


    const onSubmit = async (data: LoginDto) => {
        const result: ApiResult<LoginResultDto> = await login(data);

        if (result.data && result.data.value) {
            dispatch(setUser(result.data.value))
        }
    };

    return (
        <>
            <Form name="login" initialValues={{rememberMe: false}} onFinish={onSubmit}>
                <Form.Item<LoginDto>
                    label={"Email"}
                    name={"email"}
                    rules={[{required: true, message: "Email is required"}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item<LoginDto>
                    label={"Password"}
                    name={"password"}
                    rules={[{required: true, message: "Password is required"}]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item<LoginDto> name="rememberMe" valuePropName="checked" label={null}>
                    <Checkbox>Remember me</Checkbox>
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