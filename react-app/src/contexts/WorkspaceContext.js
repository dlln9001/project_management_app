import { useContext, createContext, useState } from "react";

const workspaceContext = createContext()

export function WorkpaceContextProvider( {children} ) {
    const [updateWorkspaces, setUpdateWorkspaces] = useState(false)
    const [updateManageWorkspace, setUpdateManageWorkspace] = useState(false)
    const [changeWorkspaceName, setChangeWorkspaceName] = useState(false)

    const values = {
        updateWorkspaces, setUpdateWorkspaces,
        changeWorkspaceName, setChangeWorkspaceName,
        updateManageWorkspace, setUpdateManageWorkspace
    }

    return (
        <workspaceContext.Provider value={values}>
            { children }
        </workspaceContext.Provider>
    )
}

export function useWorkspaceContext() {
    return useContext(workspaceContext)
}