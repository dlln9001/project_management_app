import React, { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import BoardInfo from "./BoardInfo";
import Groups from "./groups/Groups";
import { createItem } from "./groups/GroupAddItem";
import { useBoardValues } from "../../contexts/BoardValuesContext";
import { useLocation } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";


function Board(props) {
    const { renderSideBar, setRenderSideBar } = useOutletContext()
    const boardValues = useBoardValues()
    
    const userToken = JSON.parse(localStorage.getItem('userToken'))
    const query = new URLSearchParams(useLocation().search)

    const boardId = query.get('id')

    const boardTitleRef = useRef('')
    const boardInfoRef = useRef('')

    useEffect(() => {
        fetch('http://127.0.0.1:8000/board/get/', {
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
            boardValues.setBoardTitle(data.boardInfo.name)
            boardValues.setBoardInfo(data.boardInfo)
        })

        fetch('http://127.0.0.1:8000/board/get-groups/', {
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
            console.log(data)
        })


        // when a new board is clicked, you want the group's name's html to be set to the right width. Reload a second time.
        boardValues.setReloadGroupsInitial(true)

        document.addEventListener('click', handleDocumentClick)
    }, [boardId, boardValues.renderComponent])


    useEffect(() => {
        boardValues.setRenderGroups(!boardValues.renderGroups)
    }, [boardValues.groupsData])


    useEffect(() => {
        boardValues.setIsItemSelected(false)
        boardValues.setItemSelected([])
    }, [boardId])


    function handleDocumentClick(e) {
        if (boardInfoRef.current && !boardInfoRef.current.contains(e.target) && !boardTitleRef.current.contains(e.target)) {
            boardValues.setShowBoardInfo(false)
        }
    } 

    function createGroup() {
        fetch('http://127.0.0.1:8000/board/create-group/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`,
            },
            body: JSON.stringify({
                board_id: boardId,
            })
        })
        .then(res => res.json())
        .then(data => {
            if (!data.status === 'success') {
                console.log(data)
            }
            boardValues.setRenderComponent(!boardValues.renderComponent)
        })
    }

    function createItemButton() {
        let groupId = boardValues.groupsData.groupsInfo[0].id
        createItem(groupId, 'New item', '', boardId, userToken, boardValues.renderComponent, boardValues.setRenderComponent,boardValues.renderGroups, boardValues.setRenderGroups)
    }

        
    function deleteSelectedItems() {
        fetch('http://127.0.0.1:8000/board/delete-item/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                item_ids: boardValues.itemSelected
            })
        })
        .then(res => res.json())
        .then(data => boardValues.setRenderComponent(!boardValues.renderComponent))
    }

    return (
        <div className="bg-white rounded-tl-lg relative flex flex-col overflow-auto h-full custom-scrollbar">
            <div className="ml-10 mb-5 mr-1">
                <div className="sticky top-0 bg-white z-10 py-5">
                    <div >
                        <p ref={boardTitleRef} className="text-2xl hover:bg-slate-100 w-fit p-2 py-0 rounded-[4px] cursor-pointer peer" onClick={() => boardValues.setShowBoardInfo(true)}>
                            {boardValues.boardTitle}
                        </p>
                        {boardValues.showBoardInfo &&
                            <BoardInfo renderSideBar={renderSideBar} setRenderSideBar={setRenderSideBar} ref={boardInfoRef}/>
                        }
                    </div>
                    <button onClick={() => createItemButton()} className="bg-sky-600 p-[6px] px-4 rounded-sm text-white text-sm hover:bg-sky-700 mt-5">New item</button>
                </div>
                <div>

                    <Groups userToken={userToken} boardId={boardId} />
                    
                    <button className="flex gap-2 items-center border p-1 rounded-md px-2 border-slate-300 hover:bg-slate-100 mt-14" onClick={createGroup}>
                        <div> 
                            <AiOutlinePlus />
                        </div>
                        <p className="text-sm text-slate-600">Add new group</p>
                    </button>
                </div>
            </div>
            {boardValues.isItemSelected && 
                <div className=" shadow-all-sides flex rounded-md h-16 fixed mx-auto left-1/2 transform -translate-x-1/3 w-1/3 bottom-10 bg-white">
                    <div className="w-16 bg-sky-600 rounded-l-md text-white text-3xl flex justify-center items-center">
                        {boardValues.numberOfItemsSelected}
                    </div>
                    <div className="px-5 self-center text-xl">
                        {boardValues.numberOfItemsSelected === 1
                        ? <p>Item selected</p>
                        : <p>Items selected</p>
                        }
                    </div>
                    <div className="flex flex-col justify-center w-16 items-center gap-1 ml-auto cursor-pointer group" 
                        onClick={() => {
                            deleteSelectedItems()
                            boardValues.setIsItemSelected(false)
                            boardValues.setItemSelected([])
                            boardValues.setGroupsAllSelected([])
                        }}>
                        <IoTrashOutline className="text-2xl group-hover:text-sky-600"/>
                        <p className="text-xs">Delete</p>
                    </div>
                    <div className="ml-3 w-16 border-l flex justify-center items-center text-xl border-slate-400 cursor-pointer hover:text-sky-600"
                    onClick={() => {
                        boardValues.setIsItemSelected(false)
                        boardValues.setItemSelected([])
                        boardValues.setGroupsAllSelected([])
                        boardValues.setRenderGroups(!boardValues.renderGroups)
                    }}>
                        <IoMdClose />
                    </div>
                </div>
            }
            </div>
    )
}

export default Board