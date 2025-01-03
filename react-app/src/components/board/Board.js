import React, { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import BoardInfo from "./BoardInfo";
import Groups from "./groups/Groups";
import { createItem } from "./groups/GroupAddItem";
import { useBoardValues } from "../../contexts/BoardValuesContext";
import { useBoardViews } from "../../contexts/BoardViewsContext";
import { useLocation } from "react-router-dom";
import BoardViews from "./board-views/BoardViews";
import Kanban from "./board-views/Kanban";

function Board(props) {
    const { renderSideBar, setRenderSideBar } = useOutletContext()
    const boardValues = useBoardValues()
    const boardViewsValues = useBoardViews()

    const userToken = JSON.parse(localStorage.getItem('userToken'))
    const query = new URLSearchParams(useLocation().search)

    const boardId = query.get('id')

    const boardTitleRef = useRef('')
    const boardInfoRef = useRef('')

    const [boardData, setBoardData] = useState('')
    const [toSetInitialBoardView, setToSetInitialBoardView] = useState(true)

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/board/get/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`,
            },
            body: JSON.stringify({
                board_id: boardId
            })
        })
            .then(res => res.json())
            .then(data => {
                setBoardData(data)
                boardValues.setBoardTitle(data.boardInfo.name)
                boardValues.setBoardInfo(data.boardInfo)
                boardViewsValues.setBoardViewsInfo(data.boardViewsInfo)
            })

        fetch(`${process.env.REACT_APP_API_BASE_URL}/board/get-groups/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                board_id: boardId
            })
        })
            .then(res => res.json())
            .then(data => {
                boardValues.setGroupsData(data)
                // console.log(data)
            })


        // when a new board is clicked, you want the group's name's html to be set to the right width. Reload a second time.
        boardValues.setReloadGroupsInitial(true)
        
        document.addEventListener('click', handleDocumentClick)
            
    }, [boardId, boardValues.renderComponent])

    useEffect(() => {
        boardValues.setReloadGroupsInitial(true)
    }, [boardViewsValues.currentBoardView])

    useEffect(() => {
        boardValues.setRenderGroups(prev => !prev)
    }, [boardValues.groupsData])

    useEffect(() => {
        boardValues.setIsItemSelected(false)
        boardValues.setItemSelected([])
        setToSetInitialBoardView(true)
    }, [boardId])
    
    useEffect(() => {
        if (boardData && toSetInitialBoardView) {
            boardViewsValues.setCurrentBoardView(boardData.boardViewsInfo[0])
            boardViewsValues.setRenderBoardViews(prev => !prev)
            setToSetInitialBoardView(false)
        }
    }, [boardData])

    function handleDocumentClick(e) {
        if (boardInfoRef.current && !boardInfoRef.current.contains(e.target) && !boardTitleRef.current.contains(e.target)) {
            boardValues.setShowBoardInfo(false)
        }
    }

    function createItemButton() {
        let groupId = boardValues.groupsData.groupsInfo[0].id
        createItem(groupId, 'New item', '', boardId, userToken, boardValues.renderComponent, boardValues.setRenderComponent, boardValues.renderGroups, boardValues.setRenderGroups)
        boardValues.setRenderComponent(prev => !prev)
    }


    return (
        <div className="bg-white rounded-tl-lg relative  h-full custom-scrollbar min-w-fit overflow-auto" id="board-id">
            <div className={`ml-10 mb-5 mr-1`}>
                <div className="sticky top-0 bg-white z-20 py-5 w-full">
                    <div >
                        <p ref={boardTitleRef} className="text-2xl hover:bg-slate-100 w-fit p-2 py-0 rounded-[4px] cursor-pointer peer" onClick={() => boardValues.setShowBoardInfo(true)}>
                            {boardValues.boardTitle}
                        </p>
                        {boardValues.showBoardInfo &&
                            <BoardInfo renderSideBar={renderSideBar} setRenderSideBar={setRenderSideBar} ref={boardInfoRef} />
                        }
                    </div>

                    <BoardViews userToken={userToken} boardId={boardId}/>

                    <button onClick={() => createItemButton()} className="bg-sky-600 p-[6px] px-4 rounded-sm text-white text-sm hover:bg-sky-700 mt-5">New item</button>
                </div>
                {boardViewsValues.currentBoardView.type === 'Table' &&
                    <Groups userToken={userToken} boardId={boardId} />
                }

                {boardViewsValues.currentBoardView.type === 'Kanban' &&
                    <Kanban userToken={userToken}/>
                }

            </div>
        </div>
    )
}

export default Board