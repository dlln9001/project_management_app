import { useEffect, useRef, useState } from "react"
import { BsThreeDots } from "react-icons/bs";
import { GrDocumentText } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import WorkspaceItemOptions from "../../workspace_and_items/WorkspaceItemOptions";

function SidebarWorkspaceElements(props) {
    const [workspaceItemOptionsId, setWorkspaceItemOptionsId] = useState('')
    const [threeDotsPosition, setThreeDotsPosition] = useState({ top:0, left: 0})
    const navigate = useNavigate()


    function updatePosition(e) {
        const threeDocsRect = e.target.getBoundingClientRect()

        setThreeDotsPosition({
            top: threeDocsRect.top + 20,
            left: threeDocsRect.left
        })
    }

    return (
        <>
        {props.data.boards &&
            props.data.boards
                .filter(item => item.name.toLowerCase().includes(props.searchInput.toLowerCase()))  // filter for when the user searches
                .map((item, i) => {
                    let boardId = item.id
                    let selectedWorkspaceItem = JSON.parse(localStorage.getItem('selectedWorkspaceItem'))

                    return (
                            <div key={i}
                                className={`bar-button ml-0 text-sm flex items-center gap-2 group relative 
                                            ${workspaceItemOptionsId === i && `bg-slate-200`} 
                                            ${(selectedWorkspaceItem.type === 'board' && selectedWorkspaceItem.id === boardId) ? `bg-sky-100` : ``}`}
                                onClick={() => {
                                    navigate(`board?id=${encodeURIComponent(boardId)}`)
                                    localStorage.setItem('selectedWorkspaceItem', JSON.stringify({ type: 'board', id: boardId }))
                                    props.setRenderSideBar(prev => !prev)
                                }}>
            
                                <img src={process.env.PUBLIC_URL + 'images/boardsIcon.png'} alt="" className="h-4" />
            
                                <p className=" truncate">{item.name}</p>
            
                                <div className={`ml-auto group-hover:text-inherit p-1 rounded-md 
                                    ${workspaceItemOptionsId === i ? `text-inherit hover:bg-sky-200 bg-sky-200` : `text-transparent hover:bg-neutral-300`}`}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        updatePosition(e)
                                        setWorkspaceItemOptionsId(i)
                                        props.setRenderSideBar(!props.renderSideBar)
                                    }}>
                                    <div>
                                        <BsThreeDots/>
                                    </div>
                                </div>
            
                                {(workspaceItemOptionsId === i) &&
                                    <WorkspaceItemOptions 
                                        renderSideBar={props.renderSideBar} 
                                        setRenderSideBar={props.setRenderSideBar} 
                                        workspaceItemOptionsId={workspaceItemOptionsId}
                                        setWorkspaceItemOptionsId={setWorkspaceItemOptionsId} 
                                        elementId={boardId} 
                                        deletedWorkspaceName={props.deletedWorkspaceName}
                                        setDeletedWorkspaceName={props.setDeletedWorkspaceName} 
                                        workspaceType={'board'}
                                        boardName={item.name} 
                                        position={threeDotsPosition}
                                        />
                                }
                            </div>
                        )
                })
        }

        {props.data.documents &&
            props.data.documents
                .filter(item => item.title.toLowerCase().includes(props.searchInput.toLowerCase()))  // filter for when the user searches
                .map((item, i) => {
                    let documentId = item.id
                    let selectedWorkspaceItem = JSON.parse(localStorage.getItem('selectedWorkspaceItem'))
                    return (
                        <div key={i + props.data.boards.length + 1}
                            className={`bar-button ml-0 text-sm flex items-center gap-2 group relative 
                                    ${workspaceItemOptionsId === (i + props.data.boards.length + 1) && `bg-slate-200`}
                                    ${(selectedWorkspaceItem.type === 'document' && selectedWorkspaceItem.id === documentId) ? `bg-sky-100` : ``}`}
                            onClick={() => {
                                navigate(`docs?id=${encodeURIComponent(documentId)}`)
                                localStorage.setItem('selectedWorkspaceItem', JSON.stringify({ type: 'document', id: documentId }))
                                props.setRenderSideBar(prev => !prev)
                            }}>

                            <GrDocumentText />

                            <p className=" truncate">{item.title}</p>

                            <div 
                                className={`ml-auto  group-hover:text-inherit  p-1 rounded-md 
                                        ${workspaceItemOptionsId === (i + props.data.boards.length + 1) ? `text-inherit hover:bg-sky-200 bg-sky-200` : `text-transparent hover:bg-neutral-300`}`}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    updatePosition(e)
                                    setWorkspaceItemOptionsId(i + props.data.boards.length + 1)
                                    props.setRenderSideBar(!props.renderSideBar)
                                }}>
                                <div>
                                    <BsThreeDots/>
                                </div>
                            </div>

                            {(workspaceItemOptionsId === (i + props.data.boards.length + 1)) &&
                                <WorkspaceItemOptions 
                                    renderSideBar={props.renderSideBar} setRenderSideBar={props.setRenderSideBar} 
                                    workspaceItemOptionsId={workspaceItemOptionsId} setWorkspaceItemOptionsId={setWorkspaceItemOptionsId} 
                                    elementId={documentId} 
                                    workspaceType={'document'} 
                                    deletedWorkspaceName={props.deletedWorkspaceName} setDeletedWorkspaceName={props.setDeletedWorkspaceName} 
                                    docName={item.title} 
                                    position={threeDotsPosition}/>
                            }
                        </div>
                    )
                })
        }
        </>
    )
}

export default SidebarWorkspaceElements