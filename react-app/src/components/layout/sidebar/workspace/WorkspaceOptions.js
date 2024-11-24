import { useState, useEffect, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FiTrash } from "react-icons/fi";
import { IoMdArrowDropleft } from "react-icons/io";

function WorkspaceOptions(props) {
    const [showWorkpaceOptionsPopup, setShowWorkspaceOptionsPopup] = useState(false)
    const workspaceOptionsRef = useRef('')
    let selectedWorkspace = JSON.parse(localStorage.getItem('selectedWorkspaceInfo'))

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    }, [])

    function handleDocumentClick(e) {
        if (workspaceOptionsRef.current && !workspaceOptionsRef.current.contains(e.target)) {
            setShowWorkspaceOptionsPopup(false)
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
            localStorage.removeItem('selectedWorkspaceInfo')
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
                    {selectedWorkspace.is_main
                    ?
                    <div className="flex items-center gap-2 px-2 py-1 cursor-pointer rounded-sm relative group">
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
                    <div className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-slate-100 rounded-sm" onClick={deleteWorkspace}>
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