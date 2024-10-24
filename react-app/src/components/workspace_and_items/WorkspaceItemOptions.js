import { useRef, useEffect } from "react";
import { FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";


function WorkspaceItemOptions(props) {
    const userToken = JSON.parse(localStorage.getItem('userToken'))
    const optionsRef = useRef('')
    const navigate = useNavigate()

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    }, [])

    function handleDocumentClick(e) {
        if (optionsRef.current && !optionsRef.current.contains(e.target)) {
            props.setWorkspaceItemOptionsId('')
            props.setRenderSideBar(!props.renderSideBar)
        }
    }

    function determineWorkspaceItem() {
        if (props.workspaceType === 'board') {
            deleteBoard()
        }
        else if (props.workspaceType === 'doc') {
            deleteDoc()
        }
    }

    function deleteDoc() {
        fetch('http://127.0.0.1:8000/document/delete-document/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                document_id: props.documentId
            })
        })
        .then(res => res.json())
        .then(data => {
            props.setWorkspaceItemOptionsId('')
            props.setDeletedWorkspaceName(props.docName)
            props.setRenderSideBar(!props.renderSideBar)
            navigate('workspace-item-deleted')
        })
    }

    function deleteBoard() {
        fetch('http://127.0.0.1:8000/board/delete-board/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                board_id: props.boardId
            })
        })
        .then(res => res.json())
        .then(data => {
            props.setWorkspaceItemOptionsId('')
            props.setDeletedWorkspaceName(props.boardName)
            props.setRenderSideBar(!props.renderSideBar)
            navigate('workspace-item-deleted')
        })
    }


    return (
        <div ref={optionsRef} className="absolute top-8 left-56 bg-white shadow-all-sides rounded-md w-64 z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex p-[6px] hover:bg-slate-100 m-2 rounded-md items-center gap-2" 
                onClick={determineWorkspaceItem}>
                <FiTrash/>
                <p>Delete</p>
            </div>
        </div>
    )
}

export default WorkspaceItemOptions