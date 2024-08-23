import { createContext, useState, useContext } from "react";

const CreateWorkspaceItemContext = createContext()

export function CreateWorkspaceItemProvider({ children }) {
    const [showCreateWorkspaceItem, setShowCreateWorkspaceItem] = useState(false)
    const [itemType, setItemType] = useState('')
    
    const value = {
        showCreateWorkspaceItem,
        setShowCreateWorkspaceItem,
        itemType,
        setItemType
    }

    return (
        <CreateWorkspaceItemContext.Provider value={value}>
            { children }
        </CreateWorkspaceItemContext.Provider>
    )
}

export function useCreateElement() {
    return useContext(CreateWorkspaceItemContext)
}