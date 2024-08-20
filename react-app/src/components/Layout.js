import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Layout() {
    return (
        <div className="  bg-gradient-to-b from-indigo-100 to-slate-50">
            <Topbar/>
            <div className="flex h-screen overflow-x-hidden">
                <Sidebar/>
                <main className="w-full">
                    <Outlet/>
                </main>
            </div>
        </div>
    )
}

export default Layout