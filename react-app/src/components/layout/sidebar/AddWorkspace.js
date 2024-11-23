import ReactDom from "react-dom"
import { useState } from "react";
import { IoIosClose } from "react-icons/io";

function AddWorkspace(props) {
    const [workspaceName, setWorkspaceName] = useState('New Workspace')

    
    function createWorkspace() {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/workspace/create-workspace/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            },
            body: JSON.stringify({
                workspace_name: workspaceName
            })
        })
        .then(res => res.json())
        .then(data => {
            props.setShowAddWorkspace(false)
            props.setUpdateWorkspaces(prev => !prev)
        })
    }


    return ReactDom.createPortal(
        <div className="absolute top-0 left-0 w-full h-full">
            <div className=" bg-white z-50 inset-0 absolute m-auto w-[500px] h-fit rounded-md p-4 px-6">
                <div className="text-3xl ml-auto hover:bg-slate-100 cursor-pointer p-[2px] rounded-md w-fit"
                    onClick={() => props.setShowAddWorkspace(false)}>
                    <IoIosClose />
                </div>
                <h1 className="text-3xl">Add new workspace</h1>
                <div className="w-24 h-24 bg-sky-400 rounded-3xl my-10 mx-auto text-white flex justify-center items-center text-5xl">{workspaceName[0].toUpperCase()}</div>
                <div>
                    <p className="text-sm mb-2">Workspace name</p>
                    <input type="text" 
                        className=" focus:outline-none h-full w-full p-3 truncate border border-slate-300 rounded-md focus:border-sky-600" 
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}/>
                </div>
                <div className="flex gap-2 mt-8 w-fit ml-auto mb-3">
                    <button 
                        className="h-10 w-20 hover:bg-slate-100 rounded-md"
                        onClick={() => props.setShowAddWorkspace(false)}>
                            Cancel
                    </button>
                    <button className="h-10 w-36 bg-sky-600 hover:bg-sky-700 text-white rounded-md" onClick={createWorkspace}>Add workspace</button>
                </div>
            </div>
            <div className=" bg-black absolute w-full h-full top-0 opacity-60 flex justify-center items-center z-40"
                onClick={() => props.setShowAddWorkspace(false)}></div>
        </div>,
        document.getElementById('portal-root')
    )
}

export default AddWorkspace