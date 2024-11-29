import reactDom from "react-dom"
import { useEffect, useState } from "react"

function Invites(props) {
    const [invitesSentInfo, setInvitesSentInfo] = useState([])
    const [invitesReceivedInfo, setInvitesReceivedInfo] = useState([])

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
            console.log(data)
            setInvitesSentInfo(data.invites_sent)
            setInvitesReceivedInfo(data.invites_received)
        })
    }

    return reactDom.createPortal (
        <div className="absolute top-0 left-0 flex justify-center items-center h-full w-full">
            <div className="absolute top-0 h-full w-full bg-black opacity-50 z-40" onClick={() => props.setShowInvites(false)}></div>
            <div className="bg-white z-50 rounded-md w-[600px] h-[600px] p-7">
                <div>
                    <h2 className=" font-medium">Invites sent</h2>
                    {invitesSentInfo.length !== 0
                    ? 
                    <div>
                        {invitesSentInfo.map((item, index) => {
                            return (
                                <div key={index}>
                                    <div className="flex items-center">
                                        <div className="flex items-center gap-2 mt-2">
                                            {item.receiver.is_default_profile_picture
                                            ? <div className=" h-7 w-7 bg-slate-400 rounded-full text-white flex justify-center items-center">{item.receiver.name[0].toUpperCase()}</div>
                                            : <img src={`${ process.env.REACT_APP_MEDIA_BASE_URL }` + item.receiver.profile_picture} alt="" className="h-7 w-7 rounded-full object-cover"/>
                                            }
                                            <p className="truncate">{item.receiver.username}</p>
                                        </div>
                                        <p className="ml-auto text-sm text-slate-500">{item.status}</p>
                                    </div>
                                    <div className="flex items-center mt-1 gap-2">
                                        <div className={`h-7 w-7 ${item.workspace.color} flex rounded-lg text-white justify-center items-center`}>
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
                <div className="mt-[250px]">
                    <h2 className=" font-medium">Invites recieved</h2>
                    {invitesReceivedInfo.length !== 0
                    ? 
                    <div>
                        {invitesReceivedInfo.map((item, index) => {
                            return (
                                <div key={index}>
                                    <div className="flex items-center">
                                        <div className="flex items-center gap-2 mt-2">
                                            {item.sender.is_default_profile_picture
                                            ? <div className=" h-7 w-7 bg-slate-400 rounded-full text-white flex justify-center items-center">{item.sender.name[0].toUpperCase()}</div>
                                            : <img src={`${ process.env.REACT_APP_MEDIA_BASE_URL }` + item.sender.profile_picture} alt="" className="h-7 w-7 rounded-full object-cover"/>
                                            }
                                            <p className="truncate">{item.sender.username}</p>
                                        </div>
                                        <p className="ml-auto text-sm text-slate-500">{item.status}</p>
                                    </div>
                                    <div className="flex items-center mt-1 gap-2">
                                        <div className={`h-7 w-7 ${item.workspace.color} flex rounded-lg text-white justify-center items-center`}>
                                            {item.workspace.name[0].toUpperCase()}
                                        </div>
                                        <p className="truncate">{item.workspace.name}</p>
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