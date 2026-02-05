import { Outlet } from "react-router-dom";
import Header from "../Header";

const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1 pt-20">
                <Outlet />
            </main>
        </div>
    );
};

export default PublicLayout;
