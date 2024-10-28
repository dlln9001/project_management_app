import ReactDOM from 'react-dom'
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa";



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
        else if (props.workspaceType === 'document') {
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

    function addToFavorites() {
        let item_id
        props.workspaceType === 'board' ? item_id = props.boardId : item_id = props.documentId
        fetch('http://127.0.0.1:8000/workspace-element/add-to-favorites/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                element_type: props.workspaceType,
                id: item_id
            })
        })
        .then(res => res.json())
        .then(data => {
            props.setWorkspaceItemOptionsId('')
            props.setRenderSideBar(!props.renderSideBar)
        })
    }


    return document.getElementById('portal-root') && props.position ? ReactDOM.createPortal (
        <div 
            ref={optionsRef} 
            className="absolute top-8 left-56 bg-white shadow-all-sides rounded-md w-64 z-30 py-2" 
            onClick={(e) => e.stopPropagation()}
            style={{top: props.position.top, left: props.position.left}}>
            <div className="flex p-[6px] hover:bg-slate-100 mx-2 rounded-md items-center gap-2 cursor-pointer" 
                onClick={addToFavorites}>
                <FaRegStar/>
                <p>Add to favorites</p>
            </div>

            <div className="flex p-[6px] hover:bg-slate-100 mx-2 rounded-md items-center gap-2 cursor-pointer" 
                onClick={determineWorkspaceItem}>
                <FiTrash/>
                <p>Delete</p>
            </div>
        </div>,
        document.getElementById('portal-root')
    ) : null
}

export default WorkspaceItemOptions