import React, { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import BoardInfo from "./BoardInfo";
import Groups from "./groups/Groups";
import {createItem} from "./groups/Groups"
import { useLocation } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";


function Board(props) {
    const { renderSideBar, setRenderSideBar } = useOutletContext()
    
    const userToken = JSON.parse(localStorage.getItem('userToken'))
    const query = new URLSearchParams(useLocation().search)

    const [boardTitle, setBoardTitle] = useState('')
    const boardId = query.get('id')
    const [boardInfo, setBoardInfo] = useState('')

    // render groups does not send a request, render component does
    const [renderComponent, setRenderComponent] = useState(false)
    const [renderGroups, setRenderGroups] = useState(false)

    const [groupsData, setGroupsData] = useState('')
    // the width of the group names doesn't adjust until after the html has been set, so it needs to re render the groups
    const [reloadGroupsInitial, setReloadGroupsInitial] = useState(true)

    const [isItemSelected, setIsItemSelected] = useState(false)
    const [numberOfItemsSelected, setNumberOfItemsSelected] = useState('')
    const [itemSelected, setItemSelected] = useState([])
    // list of groups where all of their items have been selected
    const [groupsAllSelected, setGroupsAllSelected] = useState([])

    const [showBoardInfo, setShowBoardInfo] = useState(false)
    const boardInfoRef = useRef('')

    const boardTitleRef = useRef('')

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
            setBoardTitle(data.boardInfo.name)
            setBoardInfo(data.boardInfo)
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
            setGroupsData(data)
            console.log(data)
        })


        // when a new board is clicked, you want the group's name's html to be set to the right width. Reload a second time.
        setReloadGroupsInitial(true)

        document.addEventListener('click', handleDocumentClick)
    }, [boardId, renderComponent])

    useEffect(() => {
        setRenderGroups(!renderGroups)
    }, [groupsData])

    function handleDocumentClick(e) {
        if (boardInfoRef.current && !boardInfoRef.current.contains(e.target) && !boardTitleRef.current.contains(e.target)) {
            setShowBoardInfo(false)
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
            setRenderComponent(!renderComponent)
        })
    }

    function createItemButton() {
        let groupId = groupsData.groupsInfo[0].id
        createItem(groupId, 'New item', '', boardId, userToken, renderComponent, setRenderComponent, renderGroups, setRenderGroups)
    }

        
    function deleteSelectedItems() {
        fetch('http://127.0.0.1:8000/board/delete-item/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                item_ids: itemSelected
            })
        })
        .then(res => res.json())
        .then(data => setRenderComponent(!renderComponent))
    }
    console.log('is item selected (BOARD): ', isItemSelected)

    return (
        <div className="bg-white rounded-tl-lg relative flex flex-col overflow-auto h-full custom-scrollbar">
            <div className="ml-10 mb-5 mr-1">
                <div className="sticky top-0 bg-white z-10 py-5">
                    <div >
                        <p ref={boardTitleRef} className="text-2xl hover:bg-slate-100 w-fit p-2 py-0 rounded-[4px] cursor-pointer peer" onClick={() => setShowBoardInfo(true)}>
                            {boardTitle}
                        </p>
                        {showBoardInfo &&
                            <BoardInfo ref={boardInfoRef} boardTitle={boardTitle} setBoardTitle={setBoardTitle} boardInfo={boardInfo} setBoardInfo={setBoardInfo} renderComponent={renderComponent}
                            setRenderComponent={setRenderComponent} renderSideBar={renderSideBar} setRenderSideBar={setRenderSideBar}/>
                        }
                    </div>
                    <button onClick={() => createItemButton()} className="bg-sky-600 p-[6px] px-4 rounded-sm text-white text-sm hover:bg-sky-700 mt-5">New item</button>
                </div>
                <div>
                    <Groups groupsData={groupsData} setGroupsData={setGroupsData} userToken={userToken} boardId={boardId} renderComponent={renderComponent} setRenderComponent={setRenderComponent}
                    itemSelected={itemSelected} setItemSelected={setItemSelected} isItemSelected={isItemSelected} setIsItemSelected={setIsItemSelected} 
                    groupsAllSelected={groupsAllSelected} setGroupsAllSelected={setGroupsAllSelected} reloadGroupsInitial={reloadGroupsInitial}
                    setReloadGroupsInitial={setReloadGroupsInitial} numberOfItemsSelected={numberOfItemsSelected} setNumberOfItemsSelected={setNumberOfItemsSelected}
                    renderGroups={renderGroups} setRenderGroups={setRenderGroups}/>
                    <button className="flex gap-2 items-center border p-1 rounded-md px-2 border-slate-300 hover:bg-slate-100 mt-14" onClick={createGroup}>
                        <div> 
                            <AiOutlinePlus />
                        </div>
                        <p className="text-sm text-slate-600">Add new group</p>
                    </button>
                </div>
            </div>
            {isItemSelected && 
                <div className=" shadow-all-sides flex rounded-md h-16 fixed mx-auto left-1/2 transform -translate-x-1/3 w-1/3 bottom-10 bg-white">
                    <div className="w-16 bg-sky-600 rounded-l-md text-white text-3xl flex justify-center items-center">
                        {numberOfItemsSelected}
                    </div>
                    <div className="px-5 self-center text-xl">
                        {numberOfItemsSelected === 1
                        ? <p>Item selected</p>
                        : <p>Items selected</p>
                        }
                    </div>
                    <div className="flex flex-col justify-center w-16 items-center gap-1 ml-auto cursor-pointer group" 
                        onClick={() => {
                            deleteSelectedItems()
                            setGroupsAllSelected([])
                        }}>
                        <IoTrashOutline className="text-2xl group-hover:text-sky-600"/>
                        <p className="text-xs">Delete</p>
                    </div>
                    <div className="ml-3 w-16 border-l flex justify-center items-center text-xl border-slate-400 cursor-pointer hover:text-sky-600"
                    onClick={() => {
                        setIsItemSelected(false)
                        setItemSelected([])
                        setGroupsAllSelected([])
                        setRenderGroups(!renderGroups)
                    }}>
                        <IoMdClose />
                    </div>
                </div>
            }
        </div>
    )
}

export default Board