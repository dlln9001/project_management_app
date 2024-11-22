import ReactDOM from 'react-dom'
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa";
import { getFavorites } from '../layout/sidebar/Favorites';
import { removeFavorite } from '../layout/sidebar/FavoritedOptions';


function WorkspaceItemOptions(props) {
    const userToken = JSON.parse(localStorage.getItem('userToken'))
    const optionsRef = useRef('')
    const navigate = useNavigate()
    const [favoritesData, setFavoritesData] = useState('')
    const [favorited, setFavorited] = useState({ isFavorited: false, finishedCheck: false })
    const [favoritedId, setFavoritedId] = useState('')

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)

        getFavorites(setFavoritesData, userToken)

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    }, [])


    useEffect(() => {
        if (favoritesData) {
            let not_favorited = true
            favoritesData.map((item, i) => {
                if (item.element_type === props.workspaceType && item.id === props.elementId) {
                    setFavorited({ isFavorited: true, finishedCheck: true })
                    setFavoritedId(item.favorite_model_id)
                    not_favorited = false
                }
            })
            if (not_favorited) {
                setFavorited({ isFavorited: false, finishedCheck: true })
            }
        }
    }, [favoritesData])


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
        fetch(`${process.env.REACT_APP_API_BASE_URL}/document/delete-document/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${ userToken }`
            },
            body: JSON.stringify({
                document_id: props.elementId
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
        fetch(`${ process.env.REACT_APP_API_BASE_URL }/board/delete-board/`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${userToken}`
        },
            body: JSON.stringify({
                board_id: props.elementId
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
    fetch(`${process.env.REACT_APP_API_BASE_URL}/workspace-element/add-to-favorites/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${ userToken }`
            },
            body: JSON.stringify({
                element_type: props.workspaceType,
                id: props.elementId
            })
        })
        .then(res => res.json())
        .then(data => {
            props.setWorkspaceItemOptionsId('')
            props.setRenderSideBar(!props.renderSideBar)
        })
    }


    return document.getElementById('portal-root') && props.position ? ReactDOM.createPortal (
        <>
        {favorited.finishedCheck &&
        <div 
            ref={optionsRef} 
            className="absolute top-8 left-56 bg-white shadow-all-sides rounded-md w-64 z-30 py-2" 
            onClick={(e) => e.stopPropagation()}
            style={{top: props.position.top, left: props.position.left}}>
            {
                favorited.isFavorited
                ?
                    <div className="flex p-[6px] hover:bg-slate-100 mx-2 rounded-md items-center gap-2 cursor-pointer"
                        onClick={(e) => removeFavorite(e, userToken, favoritedId, props.setWorkspaceItemOptionsId, props.setRenderSideBar)}
                        >
                        <div>
                            <FaRegStar/>
                        </div>
                        <p>Remove from favorites</p>
                    </div>
                :
                    <div className="flex p-[6px] hover:bg-slate-100 mx-2 rounded-md items-center gap-2 cursor-pointer" 
                        onClick={addToFavorites}>
                        <FaRegStar/>
                        <p>Add to favorites</p>
                    </div>
                
            }

            <div className="flex p-[6px] hover:bg-slate-100 mx-2 rounded-md items-center gap-2 cursor-pointer" 
                onClick={determineWorkspaceItem}>
                <FiTrash/>
                <p>Delete</p>
            </div>
        </div>
        }
        </>,
        document.getElementById('portal-root')
    ) : null
}

export default WorkspaceItemOptions