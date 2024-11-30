import reactDom from "react-dom"
import { useEffect, useState } from "react"
import { useWorkspaceContext } from "../../../contexts/WorkspaceContext"
import { IoIosClose } from "react-icons/io";

function Invites(props) {
    const [invitesSentInfo, setInvitesSentInfo] = useState([])
    const [invitesReceivedInfo, setInvitesReceivedInfo] = useState([])
    const workspaceValues = useWorkspaceContext()
    const [showOnlyPending, setShowOnlyPending] = useState(true)

    useEffect(() => {
        getInvites()
    }, [])

    function getInvites() {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/user/get-invites/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setInvitesSentInfo(data.invites_sent)
            setInvitesReceivedInfo(data.invites_received)
        })
    }


    function acceptInvite(inviteId) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/user/accept-invite/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            },
            body: JSON.stringify({
                invite_id: inviteId
            })
        })
        .then(res => res.json())
        .then(data => {
            workspaceValues.setUpdateWorkspaces(prev => !prev)
            getInvites()
        })
    }

    return reactDom.createPortal (
        <div className="absolute top-0 left-0 flex justify-center items-center h-full w-full">
            <div className="absolute top-0 h-full w-full bg-black opacity-50 z-40" onClick={() => props.setShowInvites(false)}></div>
            <div className="bg-white z-50 rounded-md w-[600px] h-[600px] p-7 relative">
                <div className="absolute right-2 top-2 text-2xl cursor-pointer" onClick={() => props.setShowInvites(false)}>
                    <IoIosClose />
                </div>
                <div className="flex bg-white pb-2">
                    <h2 className=" font-medium">Invites sent</h2>
                    {showOnlyPending
                    ? <button onClick={() => setShowOnlyPending(false)} className="w-fit ml-auto border rounded-md text-slate-500 text-sm px-3 mr-3">show all</button>
                    : <button onClick={() => setShowOnlyPending(true)} className="w-fit ml-auto border rounded-md text-slate-500 text-sm px-3 mr-3">show pending</button>
                    }
                </div>
                <div className="h-[240px] overflow-auto custom-scrollbar">
                    {invitesSentInfo.length !== 0
                    ? 
                    <div>
                        {invitesSentInfo.filter((item) => {
                            if (showOnlyPending && item.status === 'pending') {
                                return item
                            }
                            else if (!showOnlyPending) {
                                return item
                            }
                        }).map((item, index) => {
                            return (
                                <div key={index} className="border border-md rounded-md mt-2 p-2">
                                    <div className="flex items-center">
                                        <div className="flex items-center gap-2">
                                            {item.receiver.is_default_profile_picture
                                            ? 
                                            <div className=" min-h-7 max-h-7 min-w-7 max-w-7 bg-slate-400 rounded-full text-white flex justify-center items-center">
                                                {item.receiver.name[0].toUpperCase()}
                                            </div>
                                            : 
                                            <img src={`${ process.env.REACT_APP_MEDIA_BASE_URL }` + item.receiver.profile_picture} alt="" 
                                                className="min-h-7 max-h-7 min-w-7 max-w-7 rounded-full object-cover"/>
                                            }
                                            <p className="truncate">{item.receiver.username}</p>
                                        </div>
                                        <p className="ml-auto text-sm text-slate-500">{item.status}</p>
                                    </div>
                                    <div className="flex items-center mt-1 gap-2">
                                        <div className={`min-h-7 max-h-7 min-w-7 max-w-7 ${item.workspace.color} flex rounded-lg text-white justify-center items-center`}>
                                            {item.workspace.name[0].toUpperCase()}
                                        </div>
                                        <p className="truncate">{item.workspace.name}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    : <p className="text-sm text-slate-500 mt-1">you have not invited anyone</p>
                    }
                </div>
                <div className="mt-10">
                    <h2 className=" font-medium">Invites recieved</h2>
                    {invitesReceivedInfo.length !== 0
                    ? 
                    <div className="h-[220px] overflow-auto custom-scrollbar">
                        {invitesReceivedInfo.filter((item) => {
                                if (showOnlyPending && item.status === 'pending') {
                                    return item
                                }
                                else if (!showOnlyPending) {
                                    return item
                                }
                            }).map((item, index) => {
                            return (
                                <div key={index} className="border border-md rounded-md mt-2 p-2 bg-white">
                                    <div className="flex items-center">
                                        <div className="flex items-center gap-2">
                                            {item.sender.is_default_profile_picture
                                            ? 
                                            <div className=" min-h-7 max-h-7 min-w-7 max-w-7 bg-slate-400 rounded-full text-white flex justify-center items-center">
                                                {item.sender.name[0].toUpperCase()}
                                            </div>
                                            : 
                                            <img src={`${ process.env.REACT_APP_MEDIA_BASE_URL }` + item.sender.profile_picture} alt="" 
                                                className="min-h-7 max-h-7 min-w-7 max-w-7 rounded-full object-cover"/>
                                            }
                                            <p className="truncate">{item.sender.username}</p>
                                        </div>
                                        <p className="ml-auto text-sm text-slate-500">{item.status}</p>
                                    </div>
                                    <div className="flex items-center mt-1 gap-2">
                                        <div className={`min-h-7 max-h-7 min-w-7 max-w-7 ${item.workspace.color} flex rounded-lg text-white justify-center items-center`}>
                                            {item.workspace.name[0].toUpperCase()}
                                        </div>
                                        <p className="truncate">{item.workspace.name}</p>
                                        {item.status !== 'accepted' && 
                                            <div className="ml-auto w-fit flex gap-2">
                                                <button 
                                                    className="border border-green-600 text-green-600 rounded-md text-sm px-3 py-1"
                                                    onClick={() => acceptInvite(item.id)}>
                                                    Accept
                                                </button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    : <p className="text-sm text-slate-500 mt-1">you have no invites</p>
                    }
                </div>
            </div>
        </div>,
        document.getElementById('portal-root')
    )
}

export default Invites