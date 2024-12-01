import reactDom from "react-dom"
import { useEffect, useState } from "react"
import { IoIosClose } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";


function WorkspaceMembers(props) {
    const [membersInfo, setMembersInfo] = useState('')
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('')
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const [updateMembers, setUpdateMembers] = useState(false)

    useEffect(() => {
        getMembers()
    }, [updateMembers])


    function getMembers() {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/workspace/get-members/${props.selectedWorkspace.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            }
        })
        .then(res => res.json())
        .then(data => setMembersInfo(data.membersInfo))
    }

    function inviteUser(email, workspaceId) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/user/invite-user-to-workspace/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            },
            body: JSON.stringify({
                email: email,
                workspace_id: workspaceId
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status !== 'success') {
                setStatus(data.status)
            }
        })
    }


    function removeMember(memberId, workspaceId) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/user/remove-member-from-workspace/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            },
            body: JSON.stringify({
                member_id: memberId,
                workspace_id: workspaceId
            })
        })
        .then(res => res.json())
        .then(data => setUpdateMembers(prev => !prev))
    }


    return reactDom.createPortal (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="absolute top-0 h-full w-full bg-black opacity-50 z-40" onClick={() => props.setShowWorkspaceMembers(false)}></div>

            <div className="absolute bg-white z-50 w-[590px] h-[585px] rounded-md p-7">
                <div className="flex">
                    <h1 className="text-2xl">Invite members to workspace</h1>
                    <div className=" text-3xl ml-auto w-fit cursor-pointer hover:bg-slate-100 h-fit rounded-md" onClick={() => props.setShowWorkspaceMembers(false)}>
                        <IoIosClose />
                    </div>
                </div>
                
                <input type="email" 
                placeholder="Invite by email" 
                className="border-2 border-slate-300 focus:outline-none hover:border-slate-400 focus:border-sky-600 text-sm px-2 py-1 w-full rounded-sm mt-5 mb-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}/>

                {email
                ? 
                <button 
                    className="w-fit p-1 px-3 bg-sky-600 hover:bg-sky-700 rounded-md text-white" 
                    onClick={() => inviteUser(email, props.selectedWorkspace.id)}>
                        Invite
                </button>
                : <button className="w-fit p-1 px-3 bg-slate-200 text-slate-400 rounded-md" disabled>Invite</button>
                }

                {status &&
                    <p className="mt-1 text-sm">{status}</p>
                }

                <p className=" font-medium text-sm mt-4">Members</p>
                <div className="mt-3 flex flex-col gap-2">
                    {membersInfo &&
                        membersInfo.map((item, index) => {
                            return (
                                <div key={index} className="flex items-center gap-2">

                                    {item.is_default_profile_picture 
                                    ? <div className=" h-7 w-7 bg-slate-400 rounded-full text-white flex justify-center items-center">{item.name[0].toUpperCase()}</div>
                                    : <img src={`${ process.env.REACT_APP_MEDIA_BASE_URL }` + item.profile_picture} alt="" className="h-7 w-7 rounded-full object-cover"/>
                                    }
                                    <p>{item.name}</p>

                                    { (userInfo.id !== item.id && userInfo.id === props.selectedWorkspace.author) &&
                                        <div className="ml-auto relative flex justify-center group cursor-pointer hover:bg-slate-100 rounded-md"
                                            onClick={() => removeMember(item.id, props.selectedWorkspace.id)}>

                                            <div className=" text-2xl">
                                                <IoIosClose />
                                            </div>

                                            <div 
                                                className=" invisible group-hover:visible text-sm absolute text-white bg-slate-700 
                                                    text-nowrap rounded-md py-1 px-3 bottom-9 flex justify-center shadow-md">
                                                <p>remove {item.name} from this workspace</p>
                                                <div className="absolute text-slate-700 text-3xl top-4">
                                                    <IoMdArrowDropdown />
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>,
        document.getElementById('portal-root')
    )
}

export default WorkspaceMembers