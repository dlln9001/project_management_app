import { useEffect, useState, useRef } from "react"
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";  
import { AiOutlinePlus } from "react-icons/ai";
import AddWorkspace from "./AddWorkspace";

function Workspaces(props) {
    const [workspaceData, setWorkspaceData] = useState('')
    const [workspacesExpanded, setWorkspacesExpanded] = useState(false)
    const workspaceButtonRef = useRef('')
    const [selectedWorkspaceIndex, setSelectedWorkspaceIndex] = useState('')
    const [showAddWorkspace, setShowAddWorkspace] = useState(false)
    const [updateWorkspaces, setUpdateWorkspaces] = useState(false)

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    }, [])

    useEffect(() => {
        getWorkspaces()
    }, [updateWorkspaces])


    function handleDocumentClick(e) {
        if (workspaceButtonRef.current && !workspaceButtonRef.current.contains(e.target)) {
            setWorkspacesExpanded(false)
        }
    }


    function getWorkspaces() {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/workspace/get-workspaces/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setWorkspaceData(data.workspace_data)
            if (!localStorage.getItem('selectedWorkspaceInfo')) {
                localStorage.setItem('selectedWorkspaceInfo', JSON.stringify({'index': 0, 'id': data.workspace_data[0].id}))
            }

            setSelectedWorkspaceIndex(JSON.parse(localStorage.getItem('selectedWorkspaceInfo')).index)
            props.setSelectedWorkspaceId(JSON.parse(localStorage.getItem('selectedWorkspaceInfo')).id)

        })
    }


    return (
        <div className="relative" ref={workspaceButtonRef}>
            {workspaceData && selectedWorkspaceIndex !== '' && 
            <>
                <div className="flex gap-2 items-center my-2 hover:bg-slate-200 px-2 py-1 cursor-pointer rounded-md mr-2" onClick={() => setWorkspacesExpanded(true)}>
                    <div className={`${workspaceData[selectedWorkspaceIndex].color} text-white rounded-md h-5 w-5 flex items-center justify-center text-sm`}>
                        {workspaceData[selectedWorkspaceIndex].name[0].toUpperCase()}
                    </div>
                    <p className=" font-medium mr-1">{workspaceData[selectedWorkspaceIndex].name}</p>
                    <div className="w-fit ml-auto">
                        {workspacesExpanded
                        ? <IoIosArrowUp />
                        : <IoIosArrowDown />
                        }
                    </div>
                </div>
                
                {workspacesExpanded && 
                    <div className="absolute bg-white shadow-all-sides z-50 rounded-md w-80">
                        <div className="m-2">
                            <p className="text-slate-500 mb-1 text-sm">My workspaces</p>
                            {workspaceData.map((item, index) => {
                                return (
                                    <div key={index} className="flex gap-2 hover:bg-slate-100 p-2 cursor-pointer rounded-md">
                                        <div className={`${item.color} text-white rounded-md h-5 w-5 flex items-center justify-center text-sm`}>{item.name[0].toUpperCase()}</div>
                                        <p className="text-sm">{item.name}</p>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="border border-b mt-5 mb-2"></div>
                        
                        <button 
                            className="flex gap-2 hover:bg-slate-100 items-center m-2 rounded-md px-3 py-2 text-sm" 
                            onClick={() => {
                                setShowAddWorkspace(true)
                                setWorkspacesExpanded(false)
                            }}>
                            <AiOutlinePlus className="" />
                            <p>Add workspace</p>
                        </button>
                    </div>
                }

                {showAddWorkspace && 
                    <AddWorkspace userToken={props.userToken} setShowAddWorkspace={setShowAddWorkspace} setUpdateWorkspaces={setUpdateWorkspaces}/>
                }
            </>
            }
        </div>
    )
}

export default Workspaces 