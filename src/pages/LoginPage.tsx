import {LoginForm} from "../forms/LoginForm.tsx";
import {RegisterForm} from "../forms/RegisterForm.tsx";
import {useState} from "react";
import {Flex, Segmented} from "antd";
import {Navigate} from "react-router";
import {selectIsAuth} from "../features/userSlice.ts";
import {useAppSelector} from "../app/hooks.ts";

export function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const isAuth = useAppSelector(selectIsAuth);

    return (<>
        {isAuth ? <Navigate to="/home"/> :
            <Flex align="center" justify="center" vertical>
                <Segmented options={["Login", "Register"]} onChange={() => setIsLogin(!isLogin)}/>
                <>
                    {isLogin ?
                        <LoginForm/>
                        : <RegisterForm/>}
                </>
            </Flex>}
    </>)
}