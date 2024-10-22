import { useRef, useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { GrHomeRounded } from "react-icons/gr";
import { PiCalendarCheck } from "react-icons/pi";
import { FaRegStar } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
import AddWorkspaceItem from "../workspace_and_items/AddWorkspaceItem";
import { useNavigate } from "react-router-dom";
import { useCreateElement } from "../../contexts/CreateWorkspaceItemContext";
import WorkspaceItemOptions from "../workspace_and_items/WorkspaceItemOptions";
import { GrDocumentText } from "react-icons/gr";


function Sidebar(props) {
    const searchBar = useRef('')
    const addWorkspaceItemRef = useRef('')
    const addWorkspaceItemButton = useRef('')
    const [showAddWorkspaceItem, setShowAddWorkspaceItem] = useState(false)
    const [workspaceElementsHtml, setWorkspaceElementsHtml] = useState('')
    const userToken = JSON.parse(localStorage.getItem('userToken'))
    const navigate = useNavigate()
    const { showCreateWorkspaceItem, setShowCreateWorkspaceItem } = useCreateElement()
    const [workspaceItemOptionsId, setWorkspaceItemOptionsId] = useState('')

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
                let tempWorkspaceElementsHtml = []
                for (let i = 0; i < data.boards.length; i++) {
                    let boardId = data.boards[i].id
                    tempWorkspaceElementsHtml.push(
                        <div key={i} className={`bar-button text-sm flex items-center gap-2 group relative ${workspaceItemOptionsId === i && `bg-slate-200`}`}
                            onClick={() => navigate(`board?id=${encodeURIComponent(boardId)}`)}>
                            <img src={process.env.PUBLIC_URL + 'images/boardsIcon.png'} alt="" className="h-4" />
                            <p className=" truncate">{data.boards[i].name}</p>
                            <div className={`ml-auto  group-hover:text-inherit  p-1 rounded-md 
                                ${workspaceItemOptionsId === i ? `text-inherit hover:bg-sky-200 bg-sky-200` : `text-white hover:bg-neutral-300`}`}
                                 onClick={(e) => {
                                        e.stopPropagation()
                                        setWorkspaceItemOptionsId(i)
                                        props.setRenderSideBar(!props.renderSideBar)
                                    }}>
                                <BsThreeDots />
                            </div>
                            {(workspaceItemOptionsId === i) &&
                                <WorkspaceItemOptions renderSideBar={props.renderSideBar} setRenderSideBar={props.setRenderSideBar} workspaceItemOptionsId={workspaceItemOptionsId}
                                setWorkspaceItemOptionsId={setWorkspaceItemOptionsId} boardId={boardId} deletedWorkspaceName={props.deletedWorkspaceName} 
                                setDeletedWorkspaceName={props.setDeletedWorkspaceName} workspaceType={'board'}
                                boardName={data.boards[i].name}/>
                            }
                        </div>
                    )
                }

                for (let i = 0; i < data.documents.length; i++) {
                    let documentId = data.documents[i].id
                    tempWorkspaceElementsHtml.push(
                        // key is like that so it's not duplicated with the board keys
                        <div key={i + data.boards.length + 1} className={`bar-button text-sm flex items-center gap-2 group relative 
                            ${workspaceItemOptionsId === (i + data.boards.length + 1) && `bg-slate-200`}`}
                            onClick={() => navigate(`docs?id=${encodeURIComponent(documentId)}`)}>
                            <GrDocumentText/>
                            <p className=" truncate">{data.documents[i].title}</p>
                            <div className={`ml-auto  group-hover:text-inherit  p-1 rounded-md 
                                ${workspaceItemOptionsId === (i + data.boards.length + 1) ? `text-inherit hover:bg-sky-200 bg-sky-200` : `text-white hover:bg-neutral-300`}`}
                                 onClick={(e) => {
                                        e.stopPropagation()
                                        setWorkspaceItemOptionsId(i + data.boards.length + 1)
                                        props.setRenderSideBar(!props.renderSideBar)
                                    }}>
                                <BsThreeDots />
                            </div>
                            {(workspaceItemOptionsId === (i + data.boards.length + 1)) &&
                                <WorkspaceItemOptions renderSideBar={props.renderSideBar} setRenderSideBar={props.setRenderSideBar} workspaceItemOptionsId={workspaceItemOptionsId}
                                setWorkspaceItemOptionsId={setWorkspaceItemOptionsId} documentId={documentId} workspaceType={'doc'} deletedWorkspaceName={props.deletedWorkspaceName} 
                                setDeletedWorkspaceName={props.setDeletedWorkspaceName} docName={data.documents[i].title}/>
                            }
                        </div>
                    )
                }
                setWorkspaceElementsHtml(tempWorkspaceElementsHtml)
            })
    }, [showCreateWorkspaceItem, props.renderSideBar])
    
    function handleDocumentClick(e) {
        if (addWorkspaceItemRef.current && !addWorkspaceItemRef.current.contains(e.target) && !addWorkspaceItemButton.current.contains(e.target)) {
            setShowAddWorkspaceItem(false)
        }
    }

    return (
        <div className=" bg-slate-50 mr-3 rounded-tr-lg w-72 flex flex-col">
            <div className="bar-button mb-1 flex items-center gap-2" onClick={() => navigate('home')}>
                <GrHomeRounded className="text-md ml-[2px]" />
                <p className=" text-sm text-slate-700">Home</p>
            </div>
            <div className="bar-button mb-1 flex items-center gap-2">
                <PiCalendarCheck className="text-xl" />
                <p className="text-sm text-slate-700">My work</p>
            </div>
            <div className="border-t border-t-slate-300"></div>
            <div className="bar-button flex items-center gap-2">
                <FaRegStar className="text-lg ml-[2px]" />
                <p className="text-sm text-slate-700">Favorites</p>
            </div>
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
            <div>
                {workspaceElementsHtml &&
                    workspaceElementsHtml
                }
            </div>
        </div>
    )
}

export default Sidebar