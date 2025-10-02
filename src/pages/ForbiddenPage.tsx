import {Button, Result} from "antd";
import {Link} from "react-router";

export function ForbiddenPage() {
    return (
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="primary">
                <Link to={"/home"}>Back Home</Link>
            </Button>}
        />
    )
}