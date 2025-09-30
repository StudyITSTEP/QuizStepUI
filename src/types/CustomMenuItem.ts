import type {MenuProps} from "antd";

type MenuItem = Required<MenuProps>['items'][number];

export type CustomMenuItems = MenuItem & {
    authOnly?: boolean
    roles?: string[]
}