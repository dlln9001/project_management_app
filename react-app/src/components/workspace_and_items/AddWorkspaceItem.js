import { useState, useContext } from "react"
import { useCreateElement } from "../../contexts/CreateWorkspaceItemContext"
import { GrDocumentText } from "react-icons/gr";

function AddWorkspaceItem(props) {
    const { showCreateWorkspaceItem, setShowCreateWorkspaceItem, itemType, setItemType } = useCreateElement()

    function showCreateBoard() {
        setShowCreateWorkspaceItem(true)
        setItemType('Board')
    }

    function showCreateDoc() {
        setShowCreateWorkspaceItem(true)
        setItemType('Doc')
    }

    return (
        <>
            <div
                className={`absolute top-0 left-[252px] bg-white shadow-all-sides w-60 rounded-lg flex flex-col transition ease-out
            ${props.showAddWorkspaceItem ? `scale-100` : `scale-0  opacity-0`} duration-75 z-30`}>
                <p className="text-sm ml-3 mt-3 text-slate-400">Add new</p>
                <div className="bar-button text-sm flex items-center gap-2" onClick={showCreateBoard}>
                    <img src={process.env.PUBLIC_URL + 'images/boardsIcon.png'} alt="" className="h-[14px]" />
                    <p>Board</p>
                </div>
                <div className="bar-button text-sm flex items-center gap-2" onClick={showCreateDoc}>
                    <GrDocumentText/>
                    <p>Doc</p>
                </div>
            </div>
        </>
    )
}

export default AddWorkspaceItem