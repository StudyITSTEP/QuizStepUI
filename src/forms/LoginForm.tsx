import {useLoginMutation} from "../api/accountApiSlice.ts";
import {useAppDispatch} from "../app/hooks.ts";
import type {LoginDto} from "../dto/loginDto.ts";
import {Alert, Button, Checkbox, Form, Input} from "antd";
import type {ApiResult} from "../types/ApiResult.ts";
import type {LoginResultDto} from "../dto/loginResultDto.ts";
import {setUser} from "../features/userSlice.ts";
import {IoMailOutline} from "react-icons/io5";
import {IoLockClosedOutline} from "react-icons/io5";
import {useState} from "react";
import {useNavigate} from "react-router";

//TODO:
/*
* 1. Error handling: Unauthorized, invalid form
*
* */

export function LoginForm() {
    const [login, {isLoading}] = useLoginMutation();
    const [error, setError] = useState()
    const navigate = useNavigate();
    const dispatch = useAppDispatch();


    const onSubmit = async (data: LoginDto) => {
        const result: ApiResult<LoginResultDto> = await login(data);
        console.log(result)

        if (result.data && result.data.value) {
            dispatch(setUser(result.data.value))
        }

        if (result.error) {
            setError(error)
        }
        if(result.data?.succeeded){
            console.log("success")
            navigate("/home")
        }
    };

    return (
        <>
            {error && <Alert type="error" message={error}/>}
            <Form name="login" initialValues={{rememberMe: false}} onFinish={onSubmit}>
                <Form.Item<LoginDto>
                    name={"email"}
                    rules={[{required: true, message: "Email is required"}, {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },]}
                >
                    <Input prefix={<IoMailOutline/>} placeholder="Email"/>
                </Form.Item>

                <Form.Item<LoginDto>
                    name={"password"}
                    rules={[{required: true, message: "Password is required"}]}
                >
                    <Input.Password prefix={<IoLockClosedOutline/>} type="password" placeholder="Password"/>
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