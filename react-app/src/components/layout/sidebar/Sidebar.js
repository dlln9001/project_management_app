import { useRef, useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { GrHomeRounded } from "react-icons/gr";
import { PiCalendarCheck } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import AddWorkspaceItem from "../../workspace_and_items/AddWorkspaceItem";
import { useCreateElement } from "../../../contexts/CreateWorkspaceItemContext";
import SidebarWorkspaceElements from "./SidebarWorkspaceElements";
import Favorites from "./Favorites";


function Sidebar(props) {
    const userToken = JSON.parse(localStorage.getItem('userToken'))
    const navigate = useNavigate()
    const searchBar = useRef('')

    const addWorkspaceItemRef = useRef('')
    const addWorkspaceItemButton = useRef('')

    const [showAddWorkspaceItem, setShowAddWorkspaceItem] = useState(false)

    const { showCreateWorkspaceItem, setShowCreateWorkspaceItem } = useCreateElement()
    const [workspaceElementData, setWorkspaceElementData] = useState('')


    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)
        fetch('http://127.0.0.1:8000/workspace-element/get/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                setWorkspaceElementData(data)
            })
    }, [showCreateWorkspaceItem, props.renderSideBar])

    function handleDocumentClick(e) {
        if (addWorkspaceItemRef.current && !addWorkspaceItemRef.current.contains(e.target) && !addWorkspaceItemButton.current.contains(e.target)) {
            setShowAddWorkspaceItem(false)
        }
    }

    return (
        <div className=" bg-slate-50 mr-3 rounded-tr-lg w-72 flex flex-col">

            <div className={`bar-button mb-1 flex items-center gap-2 
                 ${JSON.parse(localStorage.getItem('selectedWorkspaceItem')).type === 'home' && `bg-sky-100`}`}
                onClick={() => {
                    navigate('home')
                    localStorage.setItem('selectedWorkspaceItem', JSON.stringify({ type: 'home', id: 0 }))
                    props.setRenderSideBar(prev => !prev)
                }}>
                <GrHomeRounded className="text-md ml-[2px]" />
                <p className=" text-sm text-slate-700">Home</p>
            </div>

            <div className="bar-button mb-1 flex items-center gap-2">
                <PiCalendarCheck className="text-xl" />
                <p className="text-sm text-slate-700">My work</p>
            </div>

            <div className="border-t border-t-slate-300"></div>

            <Favorites 
                userToken={userToken} 
                renderSideBar={props.renderSideBar} setRenderSideBar={props.setRenderSideBar} 
                workspaceElementData={workspaceElementData}/>

            <div className="border-t border-t-slate-300"></div>

            <div className="flex mx-2 my-2 items-center gap-2 mr-4 relative" onClick={() => searchBar.current.focus()}>
                <div className="p-2 focus:outline-none border border-slate-300 rounded-md text-sm h-[34px] 
                    transition ease-in hover:border-slate-900 cursor-pointer flex gap-2">
                    <CiSearch />
                    <input type="text" placeholder="Search" ref={searchBar}
                        className=" bg-inherit focus:outline-none cursor-pointer" />
                </div>
                <div className="border p-1 border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer relative" onClick={() => setShowAddWorkspaceItem(true)} ref={addWorkspaceItemButton}>
                    <AiOutlinePlus className=" text-2xl" />
                </div>
                <div ref={addWorkspaceItemRef}>
                    <AddWorkspaceItem showAddWorkspaceItem={showAddWorkspaceItem} setShowAddWorkspaceItem={setShowAddWorkspaceItem} />
                </div>
            </div>

            <div className=" overflow-y-auto custom-scrollbar" id="sidebar-workspace-elements-id">
                {workspaceElementData &&
                    <SidebarWorkspaceElements 
                        data={workspaceElementData} 
                        renderSideBar={props.renderSideBar} 
                        setRenderSideBar={props.setRenderSideBar}
                        deletedWorkspaceName={props.deletedWorkspaceName}
                        setDeletedWorkspaceName={props.setDeletedWorkspaceName} />
                }
            </div>
        </div>
    )
}

export default Sidebar