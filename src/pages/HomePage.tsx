import {useAppSelector} from "../app/hooks.ts";
import {selectUser} from "../features/userSlice.ts";
import {CategoryPages} from "./CategoryPage.tsx";

export function HomePage() {
    const user = useAppSelector(selectUser);
    return (
        <>
            <h1>Welcome To Home Page {user.firstName} {user.lastName}!</h1>
            <CategoryPages/>
        </>
    )
}