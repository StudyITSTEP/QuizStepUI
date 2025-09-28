import {LoginForm} from "../forms/LoginForm.tsx";
import {RegisterForm} from "../forms/RegisterForm.tsx";
import {useState} from "react";
import {Flex, Segmented} from "antd";

export function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (<>
    <Flex align="center" justify="center"  vertical>
        <Segmented options={["Login", "Register"]} onChange={() => setIsLogin(!isLogin)}/>
        <>
            {isLogin ?
                <LoginForm/>
                : <RegisterForm/>}
        </>
    </Flex>
</>)
}