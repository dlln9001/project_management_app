import { useState, useEffect } from "react"
import { changeWorkspaceName } from "./WorkspaceOptions"
import { useWorkspaceContext } from "../../../../contexts/WorkspaceContext"

function ManageWorkspace() {
    let selectedWorkspace = JSON.parse(localStorage.getItem('selectedWorkspaceInfo'))
    const userToken = JSON.parse(localStorage.getItem('userToken'))
    const [workspaceInfo, setWorkspaceInfo] = useState('')
    const [workspaceName, setWorkspaceName] = useState('')

    const workspaceValues = useWorkspaceContext()

    console.log(workspaceInfo)

    useEffect(() => {
        getExtraWorkspaceInformation()
    }, [])
    
    function getExtraWorkspaceInformation() {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/workspace/get-extra-information/${selectedWorkspace.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setWorkspaceInfo(data.workspaceInfo)
            setWorkspaceName(data.workspaceInfo.name)
        })
    }

    return (
        <div className="h-full w-full bg-white rounded-md">
            <div className="h-1/4 bg-slate-100 rounded-tl-md"></div>
            {workspaceInfo &&
            <div className="ml-28 flex">
                <div className={`${workspaceInfo.color} text-white min-h-24 min-w-24 rounded-3xl flex justify-center items-center text-4xl -translate-y-10 shadow-all-sides`}>
                    {workspaceInfo.name[0].toUpperCase()}
                </div>
                <div className="ml-5 w-full flex flex-col gap-2">
                    <input type="text" 
                        className="text-3xl font-medium focus:outline-none mt-2 border border-transparent hover:border-slate-300 rounded-md px-2 truncate w-5/6 focus:border-sky-600" 
                        value={workspaceName} 
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        onBlur={(e) => changeWorkspaceName(userToken, e.target.value, workspaceInfo.id, workspaceValues.setChangeWorkspaceName, workspaceValues.setUpdateWorkspaces)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.target.blur()
                            }
                        }}/>
                    <input type="text" 
                        className="border border-dashed border-transparent hover:border-slate-300 focus:outline-none w-3/5 px-1"
                        placeholder="Add workspace description"/>
                </div>
            </div>
            }
        </div>
    )
}

export default ManageWorkspace