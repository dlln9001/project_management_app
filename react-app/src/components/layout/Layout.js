import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import Topbar from "./Topbar";
import CreateWorkspaceItem from "../workspace_and_items/CreateWorkspaceItem";
import { useCreateElement } from "../../contexts/CreateWorkspaceItemContext";
import { useState } from "react";
import { WorkpaceContextProvider } from "../../contexts/WorkspaceContext";

function Layout() {
    const { showCreateWorkspaceItem, setShowCreateWorkspaceItem } = useCreateElement()
    const [renderSideBar, setRenderSideBar] = useState(false)
    const [deletedWorkspaceName, setDeletedWorkspaceName] = useState('')

    return (
        <>
            <div className="bg-gradient-to-b from-indigo-100 to-slate-50 relative h-screen">
                <div className="h-full flex flex-col">
                    <WorkpaceContextProvider>
                        <div className="flex-none">
                            <Topbar />
                        </div>
                        <div className="flex h-full overflow-y-hidden custom-scrollbar">
                            <Sidebar renderSideBar={renderSideBar} setRenderSideBar={setRenderSideBar} deletedWorkspaceName={deletedWorkspaceName} setDeletedWorkspaceName={setDeletedWorkspaceName} />
                            <main className="w-full">
                                <Outlet context={{ renderSideBar, setRenderSideBar, deletedWorkspaceName, setDeletedWorkspaceName }} />
                            </main>
                        </div>
                    </WorkpaceContextProvider>
                </div>
                {showCreateWorkspaceItem &&
                    <>
                        <div className="flex justify-center items-center absolute top-0 w-full h-full">
                            <div className=" bg-black absolute w-full h-full top-0 opacity-60 flex justify-center items-center z-30" onClick={() => setShowCreateWorkspaceItem(false)}></div>
                            <CreateWorkspaceItem />
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default Layout