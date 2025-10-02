import {notification, type NotificationArgsProps} from "antd";
import {useLayoutEffect} from "react";

type NotificationPlacement = NotificationArgsProps['placement'];
type NotificationType = "success" | "error" | "warning" | "info";

type MyNotificationProps = {
    placement: NotificationPlacement,
    type: NotificationType,
    message: string,
    description?: string
}

export const MyNotification = ({...props}: MyNotificationProps ) => {
    const [api, contextHolder] = notification.useNotification();
    const openNotification = () => {
        switch (props.type) {
            case "success": {
                api.success({
                    message: props.message,
                    description: props.description,
                    placement: props.placement,
                });
                break;
            }

            case "warning": {
                api.warning({
                    message: props.message,
                    description: props.description,
                    placement: props.placement,
                });
                break;
            }
            case "error": {
                api.error({
                    message: props.message,
                    description: props.description,
                    placement: props.placement,
                });
                break;
            }
            case "info": {
                api.info({
                    message: props.message,
                    description: props.description,
                    placement: props.placement,
                });
                break;
            }
            default:
                break;
        }

    };
    useLayoutEffect(() => {
        openNotification();
    })
    return (
        <>
            {contextHolder}
        </>
    )
}