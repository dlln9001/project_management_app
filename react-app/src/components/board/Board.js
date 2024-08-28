import React, { useEffect, useState, useRef } from "react"
import { useLocation } from "react-router-dom"
import { AiOutlinePlus } from "react-icons/ai";
import { FaCheck } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";


function Board() {
    const userToken = JSON.parse(localStorage.getItem('userToken'))
    const query = new URLSearchParams(useLocation().search)

    const [boardTitle, setBoardTitle] = useState('')
    const boardId = query.get('id')
    const [groupHtml, setGroupHtml] = useState('')
    // render groups does not send a request, render component does
    const [renderComponent, setRenderComponent] = useState(false)
    const [renderGroups, setRenderGroups] = useState(false)

    const [addItemContent, setAddItemContent] = useState('')
    const [focusedAddItem, setFocusedAddItem] = useState('')
    const [groupsData, setGroupsData] = useState('')

    const [focusedItem, setFocusedItem] = useState([])
    const [editingItemContents, setEditingItemContents] = useState('')

    const [itemSelected, setItemSelected] = useState([])
    const [isItemSelected, setIsItemSelected] = useState(false)
    const [numberOfItemsSelected, setNumberOfItemsSelected] = useState('')

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
            setRenderGroups(!renderGroups)
        })
    }, [boardId, renderComponent])

    // renders all the groups in a separate use effect than the fetch
    useEffect(() => {
        if (groupsData) {
            let tempGroupHtml = []
            let itemsHtml = []
            let itemHtml = []
            // this variable is so that when a user clicks on a new board, when items are selected, that the item menu doesn't show up on separate boards
            let itemIdCheck = false
            for (let i=0; i<groupsData.itemsInfo.length; i++) {
                for (let j=0; j<groupsData.itemsInfo[i].length; j++) {
                    if (itemSelected.includes(groupsData.itemsInfo[i][j].id)) {
                        itemIdCheck = true
                    }
                    itemHtml.push(
                        <div key={j} className="border-r border-r-slate-300 w-1/3 text-sm text-slate-600 hover:bg-slate-100 flex">
                                <div className="bg-black w-[6px] justify-self-start min-w-[6px]"></div>
                                <div className="p-2 flex items-center border-r border-r-slate-300 border-t border-t-slate-300">
                                    <div className={`w-4 h-4 border  cursor-pointer rounded-sm
                                         ${itemSelected.includes(groupsData.itemsInfo[i][j].id) ? `bg-sky-600 hover:bg-sky-700` : `bg-white border-slate-300 hover:border-slate-600`}`}
                                         onClick={() => handleItemSelect(i, j)}
                                    >
                                        {itemSelected.includes(groupsData.itemsInfo[i][j].id) && 
                                            <FaCheck color="white" className="h-4/5 w-4/5 mx-auto my-[1px]"/>
                                        }
                                    </div>
                                </div>
                            <div className="px-2 border-t flex border-t-slate-300 w-full">
                                <input type="text" 
                                    onFocus={() => {
                                        setFocusedItem([i, j])
                                        setEditingItemContents(groupsData.itemsInfo[i][j].name)
                                        setRenderGroups(!renderGroups)
                                    }}
                                    onBlur={(e) => editItem(e.target.value, groupsData.itemsInfo[i][j].id)}
                                    onChange={(e) => {
                                        setEditingItemContents(e.target.value)
                                        setRenderGroups(!renderGroups)
                                    }}
                                    value={(focusedItem[0] === i && focusedItem[1] === j) ? editingItemContents : groupsData.itemsInfo[i][j].name}
                                    tabIndex={0}
                                    className={`border border-transparent focus:outline-none hover:border hover:border-slate-300 rounded-sm px-1 focus:bg-white 
                                            truncate text-ellipsis min-w-8 w-full focus:border-sky-600 h-fit self-center`}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            editItem(editingItemContents, groupsData.itemsInfo[i][j].id)
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )
                }   
                itemsHtml.push(
                    <div key={i}>
                        {itemHtml}
                    </div>
                )
                itemHtml = []
            }
            if (!itemIdCheck) {
                setIsItemSelected(false)
                setItemSelected([])
            }
            for (let i=0; i<groupsData.groupsInfo.length; i++) {
                let currentGroup = groupsData.groupsInfo[i]  
                let groupId = currentGroup.id
                tempGroupHtml.push(
                    <div key={i} className="mt-10">
                        <p className="mb-1">{currentGroup.name}</p>
                        <div className="border border-slate-300 rounded-md border-r-0 border-l-0 rounded-r-none">
                            <div className="w-1/3 border-r border-r-slate-300 flex">
                                <div className="bg-black w-[6px] justify-self-start rounded-tl-md"></div>
                                <div className="p-2 flex items-center border-r border-r-slate-300">
                                    <div className="w-4 h-4 border border-slate-300 hover:border-slate-600 cursor-pointer rounded-sm"></div>
                                </div>
                                <p className="p-1 text-sm text-slate-600 mx-auto self-center">Item</p>
                            </div>

                                {itemsHtml[i]}

                            <div className={`flex`}>
                                <div className="bg-black w-[6px] justify-self-start rounded-bl-md"></div>
                                <div className="p-2 flex items-center border-r border-r-slate-300 border-t border-t-slate-300">
                                    <div className="w-4 h-4 border border-slate-300 rounded-sm"></div>
                                </div>
                                <div className="w-full flex items-center pl-2 border-t border-t-slate-300">
                                    <input type="text" placeholder="+ Add item"   
                                    className="w-1/5 border border-white text-sm pl-5 focus:outline-none hover:border-slate-200 hover:border rounded-sm
                                    focus:border-sky-600 text-slate-600 h-fit"
                                    onFocus={() => addItemFocus(i)}
                                    value={focusedAddItem === i ? addItemContent : ''}
                                    onChange={(e) => changeFocusedAddItem(e.target.value)}
                                    onBlur={() => createItem(groupId, addItemContent)}
                                    onKeyDown={(e) => enterAddItem(e, groupId, addItemContent)}
                                    /> 
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            setGroupHtml(tempGroupHtml)
        }
    }, [renderGroups])

    function handleItemSelect(groupIndex, itemIndex) {
        let tempItemSelected = itemSelected
        if (tempItemSelected.includes(groupsData.itemsInfo[groupIndex][itemIndex].id)) {
            for (let i=0; i<tempItemSelected.length; i++) {
                if (tempItemSelected[i] === groupsData.itemsInfo[groupIndex][itemIndex].id) {
                    tempItemSelected.splice(i, 1)
                }
            }
            if (tempItemSelected.length === 0) {
                setIsItemSelected(false)
            }
            setNumberOfItemsSelected(tempItemSelected.length)
            setItemSelected(tempItemSelected)
        }
        else {
            setNumberOfItemsSelected(itemSelected.length + 1)
            setItemSelected(oldArr => [...oldArr, groupsData.itemsInfo[groupIndex][itemIndex].id])
            setIsItemSelected(true)
        }
        setRenderGroups(!renderGroups)
    }

    function editItem(itemContent, itemId) {
        fetch('http://127.0.0.1:8000/board/edit-item/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                item_id: itemId,
                item_name: itemContent,
            })
        })
        .then(res => res.json())
        .then(data => setRenderComponent(!renderComponent))
    }

    function enterAddItem(e, groupId, addItemContent) {
        if (e.key === 'Enter') {
            createItem(groupId, addItemContent)
        }
    }

    function changeFocusedAddItem(value) {
        setAddItemContent(value)
        setRenderGroups(!renderGroups)
    }

    function addItemFocus(i) {
        setFocusedAddItem(i)
        setRenderGroups(!renderGroups)
    }

    function createItem(groupId, addItemContent) {
        if (addItemContent) {
            fetch('http://127.0.0.1:8000/board/create-item/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userToken}`
                },
                body: JSON.stringify({
                    group_id: groupId,
                    name: addItemContent
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status != 'success') {
                    console.log(data)
                }
                setRenderComponent(!renderComponent)
            })
        }
        setAddItemContent('')
        setRenderGroups(!renderGroups)

    }

    function createItemButton() {
        let groupId = groupsData.groupsInfo[0].id
        createItem(groupId, 'New item')
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

    return (
        <div className="bg-white h-screen rounded-tl-lg pl-10 py-5 pr-1 relative">
            <p className="text-2xl hover:bg-slate-100 w-fit p-1 py-0 rounded-md cursor-pointer">{boardTitle}</p>
            <button onClick={() => createItemButton()} className="bg-sky-600 p-[6px] px-4 rounded-sm text-white text-sm hover:bg-sky-700 mt-5">New item</button>
            {groupHtml &&
                    groupHtml
            }
            <button className="flex gap-2 items-center border p-1 rounded-md px-2 border-slate-300 hover:bg-slate-100 mt-14" onClick={createGroup}>
                <div> 
                    <AiOutlinePlus />
                </div>
                <p className="text-sm text-slate-600">Add new group</p>
            </button>
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
                    <div className="flex flex-col justify-center w-16 items-center gap-1 ml-auto cursor-pointer group" onClick={deleteSelectedItems}>
                        <IoTrashOutline className="text-2xl group-hover:text-sky-600"/>
                        <p className="text-xs">Delete</p>
                    </div>
                    <div className="ml-3 w-16 border-l flex justify-center items-center text-xl border-slate-400 cursor-pointer hover:text-sky-600"
                    onClick={() => {
                        setIsItemSelected(false)
                        setItemSelected([])
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