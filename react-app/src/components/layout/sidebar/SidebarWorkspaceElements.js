import { useEffect, useState } from "react"
import { BsThreeDots } from "react-icons/bs";
import { GrDocumentText } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import WorkspaceItemOptions from "../../workspace_and_items/WorkspaceItemOptions";

function SidebarWorkspaceElements(props) {
    const [workspaceItemOptionsId, setWorkspaceItemOptionsId] = useState('')
    const [workspaceElementsHtml, setWorkspaceElementsHtml] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        let tempWorkspaceElementsHtml = []
        let selectedWorkspaceItem

        for (let i = 0; i < props.data.boards.length; i++) {
            let boardId = props.data.boards[i].id
            selectedWorkspaceItem = JSON.parse(localStorage.getItem('selectedWorkspaceItem'))
            tempWorkspaceElementsHtml.push(
                <div key={i}
                    className={`bar-button text-sm flex items-center gap-2 group relative 
                                ${workspaceItemOptionsId === i && `bg-slate-200`} 
                                ${(selectedWorkspaceItem.type === 'board' && selectedWorkspaceItem.id === boardId) ? `bg-sky-100` : ``}`}
                    onClick={() => {
                        navigate(`board?id=${encodeURIComponent(boardId)}`)
                        localStorage.setItem('selectedWorkspaceItem', JSON.stringify({ type: 'board', id: boardId }))
                        props.setRenderSideBar(prev => !prev)
                    }}>

                    <img src={process.env.PUBLIC_URL + 'images/boardsIcon.png'} alt="" className="h-4" />

                    <p className=" truncate">{props.data.boards[i].name}</p>

                    <div className={`ml-auto  group-hover:text-inherit  p-1 rounded-md 
                        ${workspaceItemOptionsId === i ? `text-inherit hover:bg-sky-200 bg-sky-200` : `text-transparent hover:bg-neutral-300`}`}
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
                            boardName={props.data.boards[i].name} />
                    }
                </div>
            )
        }

        for (let i = 0; i < props.data.documents.length; i++) {
            let documentId = props.data.documents[i].id
            selectedWorkspaceItem = JSON.parse(localStorage.getItem('selectedWorkspaceItem'))

            tempWorkspaceElementsHtml.push(
                // key is like that so it's not duplicated with the board keys
                <div key={i + props.data.boards.length + 1}
                    className={`bar-button text-sm flex items-center gap-2 group relative 
                    ${workspaceItemOptionsId === (i + props.data.boards.length + 1) && `bg-slate-200`}
                    ${(selectedWorkspaceItem.type === 'document' && selectedWorkspaceItem.id === documentId) ? `bg-sky-100` : ``}`}
                    onClick={() => {
                        navigate(`docs?id=${encodeURIComponent(documentId)}`)
                        localStorage.setItem('selectedWorkspaceItem', JSON.stringify({ type: 'document', id: documentId }))
                        props.setRenderSideBar(prev => !prev)
                    }}>

                    <GrDocumentText />

                    <p className=" truncate">{props.data.documents[i].title}</p>

                    <div className={`ml-auto  group-hover:text-inherit  p-1 rounded-md 
                        ${workspaceItemOptionsId === (i + props.data.boards.length + 1) ? `text-inherit hover:bg-sky-200 bg-sky-200` : `text-transparent hover:bg-neutral-300`}`}
                        onClick={(e) => {
                            e.stopPropagation()
                            setWorkspaceItemOptionsId(i + props.data.boards.length + 1)
                            props.setRenderSideBar(!props.renderSideBar)
                        }}>
                        <BsThreeDots />
                    </div>

                    {(workspaceItemOptionsId === (i + props.data.boards.length + 1)) &&
                        <WorkspaceItemOptions renderSideBar={props.renderSideBar} setRenderSideBar={props.setRenderSideBar} workspaceItemOptionsId={workspaceItemOptionsId}
                            setWorkspaceItemOptionsId={setWorkspaceItemOptionsId} documentId={documentId} workspaceType={'doc'} deletedWorkspaceName={props.deletedWorkspaceName}
                            setDeletedWorkspaceName={props.setDeletedWorkspaceName} docName={props.data.documents[i].title} />
                    }
                </div>
            )
        }

        setWorkspaceElementsHtml(tempWorkspaceElementsHtml)

    }, [props.data])

    return (
        workspaceElementsHtml
    )
}

export default SidebarWorkspaceElements