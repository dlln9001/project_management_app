import { useState, useEffect } from "react"
import { useUserContext } from "../contexts/UserContext"
import { GrDocumentText } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";


function Home() {
    const { userInfo, setUserInfo } = useUserContext()
    const { renderSideBar, setRenderSideBar } = useOutletContext()
    const [recentlyVisitedData, setRecentlyVisitedData] = useState('')
    const navigate = useNavigate()
    const username = JSON.parse(localStorage.getItem('userInfo')).username
    const name = JSON.parse(localStorage.getItem('userInfo')).name
    const token = JSON.parse(localStorage.getItem('userToken'))

    useEffect(() => {
        fetch('http://127.0.0.1:8000/workspace-element/get-recently-visited-elements/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        })
        .then(res => res.json())
        .then(data => setRecentlyVisitedData(data.recently_visited_data))
    }, [])


    return (
        <div className=" bg-white h-screen rounded-tl-lg">
            <div className="mb-7 shadow-md">
                <div className="mx-24 py-4">
                    <p className="text-sm opacity-80">Hello, {name}!</p>
                    <p className=" font-medium">Quickly access your boards and documents</p>
                </div>
            </div>
            
            <div className={`shadow-all-sides rounded-md py-6 px-7 mx-24`}>
                <p className="font-medium mb-4">Recently Visited</p>
                <div className="flex gap-4">
                    {recentlyVisitedData && recentlyVisitedData.map((item, index) => {
                        return (
                            <div key={index}>
                                <div className="flex gap-2 items-center min-w-48 max-w-48 border px-3 py-[6px] border-slate-300 hover:border-transparent hover:shadow-all-sides 
                                                cursor-pointer rounded-[4px]"
                                    onClick={() => {
                                        if (item.element_type === 'board') {
                                            navigate(`/board?id=${encodeURIComponent(item.id)}`)
                                            localStorage.setItem('selectedWorkspaceItem', JSON.stringify({type: item.element_type, id: item.id}))
                                            setRenderSideBar(prev => !prev)
                                        }
                                        else if (item.element_type === 'document') {
                                            navigate(`/docs?id=${encodeURIComponent(item.id)}`)
                                            localStorage.setItem('selectedWorkspaceItem', JSON.stringify({type: item.element_type, id: item.id}))
                                            setRenderSideBar(prev => !prev)
                                        }
                                    }}>
                                    {item.element_type === 'board' &&
                                        <img src={process.env.PUBLIC_URL + 'images/boardsIcon.png'} alt="" className="h-4" />
                                    }
                                    {item.element_type === 'document' &&
                                        <GrDocumentText className="text-lg"/>
                                    }
                                    <p className="font-medium text-ellipsis w-full overflow-hidden whitespace-nowrap">{item.element_name}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Home