import reactDom from "react-dom"
import { useEffect, useState } from "react"
import { IoIosClose } from "react-icons/io";

function WorkspaceMembers(props) {
    const [membersInfo, setMembersInfo] = useState('')

    useEffect(() => {
        getMembers()
    }, [])


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
                <input type="text" 
                placeholder="Search by name or email" 
                className="border-2 border-slate-300 focus:outline-none hover:border-slate-400 focus:border-sky-600 text-sm px-2 py-1 w-full rounded-sm mt-5"/>
                <p className=" font-medium text-sm mt-5">Members</p>
                <div className="mt-3">
                    {membersInfo &&
                        membersInfo.map((item, index) => {
                            return (
                                <div key={index} className="flex items-center gap-2">
                                    {item.is_default_profile_picture 
                                    ? <div className=" h-7 w-7 bg-slate-400 rounded-full">{item.name[0].toUpperCase()}</div>
                                    : <img src={`${ process.env.REACT_APP_MEDIA_BASE_URL }` + item.profile_picture} alt="" className="h-7 w-7 rounded-full object-cover"/>
                                    }
                                    <p>{item.name}</p>
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