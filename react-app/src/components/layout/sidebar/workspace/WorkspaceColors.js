import { useWorkspaceContext } from "../../../../contexts/WorkspaceContext"


function WorkspaceColors(props) {
    const workspaceValues = useWorkspaceContext()

    const colorOptions = ['bg-emerald-600', 'bg-green-500', 'bg-lime-500', 'bg-yellow-500', 'bg-amber-400', 'bg-violet-600', 'bg-purple-500', 'bg-blue-500', 'bg-sky-400',
        'bg-cyan-300', 'bg-rose-700', 'bg-red-500', 'bg-pink-600', 'bg-pink-300', 'bg-orange-600', 'bg-amber-500', 'bg-yellow-800', 'bg-gray-300',
        'bg-gray-500', 'bg-slate-600']

    function changeColor(color, workspaceId) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/workspace/change-color/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            },
            body: JSON.stringify({
                color: color,
                workspace_id: workspaceId
            })
        })
        .then(res => res.json())
        .then(data => {
            workspaceValues.setUpdateManageWorkspace(prev => !prev)
            workspaceValues.setUpdateWorkspaces(prev => !prev)
        })
    }

    return (
        <div className="bg-white shadow-all-sides w-64 rounded-md p-5">
            <p className="text-slate-500 text-sm mb-3">Background color</p>
            <div className="flex gap-2 max-w-full flex-wrap">
                {colorOptions.map((item, index) => {
                    return (
                        <div key={index}
                            className={`${item} min-h-6 max-h-6 min-w-6 max-w-6 rounded-full cursor-pointer`}
                            onClick={() => changeColor(item, props.selectedWorkspace.id)}> 
                        </div>
                    )
                })

                }
            </div>
        </div>
    )
}

export default WorkspaceColors