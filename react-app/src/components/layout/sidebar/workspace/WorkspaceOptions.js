import { useState, useEffect, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FiTrash } from "react-icons/fi";
import { IoMdArrowDropleft } from "react-icons/io";
import { GoPencil } from "react-icons/go";
import { GoGear } from "react-icons/go";
import { MdOutlineColorLens } from "react-icons/md";
import { useNavigate } from "react-router-dom"
import WorkspaceColors from "./WorkspaceColors";
import { useWorkspaceContext } from "../../../../contexts/WorkspaceContext";

export function changeWorkspaceName(userToken, workspaceName, workspaceId, setChangeWorkspaceName, setUpdateWorkspaces) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/workspace/change-workspace-name/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${userToken}`
        },
        body: JSON.stringify({
            workspace_name: workspaceName,
            workspace_id: workspaceId
        })
    })
    .then(res => res.json())
    .then(data => {
        localStorage.removeItem('selectedWorkspaceInfo')
        setChangeWorkspaceName(false)
        setUpdateWorkspaces(prev => !prev)
    })
}

function WorkspaceOptions(props) {
    const navigate = useNavigate()
    let selectedWorkspace = JSON.parse(localStorage.getItem('selectedWorkspaceInfo'))
    const workspaceValues = useWorkspaceContext()

    const [showWorkpaceOptionsPopup, setShowWorkspaceOptionsPopup] = useState(false)
    const [showColors, setShowColors] = useState(false)

    const workspaceOptionsRef = useRef('')
    const changeColorRef = useRef('')

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    }, [])

    useEffect(() => {
        if (props.changeWorkspaceName) {
            changeWorkspaceName(props.userToken, props.workspaceName, selectedWorkspace.id, props.setChangeWorkspaceName, props.setUpdateWorkspaces)
        }
    }, [props.changeWorkspaceName])

    function handleDocumentClick(e) {
        if (workspaceOptionsRef.current && !workspaceOptionsRef.current.contains(e.target)) {
            setShowWorkspaceOptionsPopup(false)
        }

        if (changeColorRef.current && !changeColorRef.current.contains(e.target)) {
            setShowColors(false)
        }
    }

    function deleteWorkspace() {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/workspace/delete-workspace/${selectedWorkspace.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            }
        })
        .then(res => res.json())
        .then(data => {
            localStorage.removeItem('selectedWorkspaceInfo') // workspace component will detect the missing info, send a request to fill it in again. 
            selectedWorkspace = ''
            setShowWorkspaceOptionsPopup(false)
            props.setUpdateWorkspaces(prev => !prev)
        })
    }

    return (
        <div className="ml-1 relative" ref={workspaceOptionsRef}>
            <div className={` cursor-pointer p-2 rounded-md ${showWorkpaceOptionsPopup ? `bg-sky-100` : `hover:bg-slate-200`}`} 
                onClick={() => setShowWorkspaceOptionsPopup(true)}>
                <BsThreeDots />
            </div>
            {showWorkpaceOptionsPopup && selectedWorkspace && 
                <div className="absolute bg-white w-64 shadow-all-sides z-40 p-2 rounded-md">

                    <div className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-slate-100 rounded-md" 
                        onClick={() => {
                            navigate('/manage-workspace')
                            workspaceValues.setUpdateManageWorkspace(prev => !prev)
                            setShowWorkspaceOptionsPopup(false)
                            }}>
                        <div>
                            <GoGear />
                        </div>
                        <p className="text-sm">Manage workspace</p>
                    </div>

                    <div 
                        className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-slate-100 rounded-md"
                        onClick={() => {
                            props.setIsEditingName(true)
                            props.setWorkspaceName(props.initialWorkspaceName)
                            setShowWorkspaceOptionsPopup(false)
                        }}>
                        <div>
                            <GoPencil />
                        </div>
                        <p className="text-sm">Rename workspace</p>
                    </div>

                    <div className="flex items-center relative" ref={changeColorRef}>
                        <div 
                            className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-slate-100 rounded-md w-full"
                            onClick={() => setShowColors(true)}>
                            <div>
                                <MdOutlineColorLens />
                            </div>
                            <p className="text-sm">Change color</p>
                        </div>
                        {showColors && 
                            <div className="absolute left-full top-0">
                                <WorkspaceColors userToken={props.userToken} selectedWorkspace={selectedWorkspace}/>
                            </div>
                        }
                    </div>


                    {selectedWorkspace.is_main
                    ?
                    <div className="flex items-center gap-2 px-2 py-1 cursor-pointer rounded-md relative group">
                        <div className="opacity-50">
                            <FiTrash/>
                        </div>
                        <p className="text-sm opacity-50">Delete workspace</p>
                        <div className="absolute left-[248px] text-white bg-slate-800 text-nowrap w-fit px-2 py-1 rounded-md text-sm invisible group-hover:visible">
                            <div className="text-slate-800 absolute text-3xl right-[247px] flex items-center top-0 bottom-0">
                                <IoMdArrowDropleft />
                            </div>
                            The main workspace cannot be deleted
                        </div>
                    </div>
                    :
                    <div className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-slate-100 rounded-md" onClick={deleteWorkspace}>
                        <div>
                            <FiTrash/>
                        </div>
                        <p className="text-sm">Delete workspace</p>
                    </div>
                    }

                </div>
            }
        </div>
    )
}

export default WorkspaceOptions