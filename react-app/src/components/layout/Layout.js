import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CreateWorkspaceItem from "../CreateWorkspaceItem";
import { useCreateElement } from "../../contexts/CreateWorkspaceItemContext";
import { useState } from "react";


function Layout() {
    const {showCreateWorkspaceItem, setShowCreateWorkspaceItem} = useCreateElement()
    const [renderSideBar, setRenderSideBar] = useState(false)

    return (
        <>
            <div className="bg-gradient-to-b from-indigo-100 to-slate-50 relative h-screen">
                <div className="h-full flex flex-col">
                    <div className="flex-none">
                        <Topbar />
                    </div>
                    <div className="flex overflow-hidden h-full">
                            <Sidebar renderSideBar={renderSideBar} setRenderSideBar={setRenderSideBar}/>
                        <main className="w-full">
                            <Outlet context={{ renderSideBar, setRenderSideBar}}/>
                        </main>
                    </div>
                </div>
                {showCreateWorkspaceItem && 
                <>
                    <div className="flex justify-center items-center absolute top-0 w-full h-full">
                        <div className=" bg-black absolute w-full h-full top-0 opacity-60 flex justify-center items-center z-10" onClick={() => setShowCreateWorkspaceItem(false)}></div>
                        <CreateWorkspaceItem/>
                    </div>
                </>
                }
            </div>
        </>
    )
}

export default Layout