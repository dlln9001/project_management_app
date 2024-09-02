import React, { useEffect, useState, useRef } from "react"
import { useLocation } from "react-router-dom"
import { AiOutlinePlus } from "react-icons/ai";
import { FaCheck } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import { GoTriangleDown } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs";
import { FiTrash } from "react-icons/fi";


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

    // list of groups where all of their items have been selected
    const [groupsAllSelected, setGroupsAllSelected] = useState([])

    const groupInputRef = useRef([])
    const measureGroupInputRef = useRef([])

    // the width of the group names doesn't adjust until after the html has been set, so it needs to re render the groups
    const [reloadGroupsInitial, setReloadGroupsInitial] = useState(true)
    
    const [editingGroupName, setEditingGroupName] = useState('')
    const [editingGroupId, setEditingGroupId] = useState('')
    const [isEditingGroupName, setIsEditingGroupName] = useState(false)

    const [showGroupOptions, setShowGroupOptions] = useState(false)
    const [groupOptionsId, setGroupOptionsId] = useState('')
    const groupOptionsRef = useRef('')

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

        // when a new board is clicked, you want the group's name's html to be set to the right width. Reload a second time.
        setReloadGroupsInitial(true)

        document.addEventListener('click', handleDocumentClick)
    }, [boardId, renderComponent])

    function handleDocumentClick(e) {
        // closes out the group options
        if (groupOptionsRef.current && !groupOptionsRef.current.contains(e.target)) {
            setShowGroupOptions(false)
            setGroupOptionsId('')
            setRenderGroups(!renderGroups)
        }
    }

    // renders all the groups in a separate use effect than the fetch
    useEffect(() => {
        if (groupsData) {
            let tempGroupHtml = []
            let itemsHtml = []
            let itemHtml = []
            // this variable is so that when a user clicks on a new board, when items are selected, that the item menu doesn't show up on separate boards
            let itemIdCheck = false
            // sets all the items html
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
            // set the group html
            for (let i=0; i<groupsData.groupsInfo.length; i++) {
                let currentGroup = groupsData.groupsInfo[i]  
                let groupId = currentGroup.id
                let currentGroupsItems = groupsData.itemsInfo[i]

                tempGroupHtml.push(
                    <div key={i} className="mt-10">
                        <div className="flex items-center mb-2 group">
                            <div className={`absolute left-3 group-hover:text-inherit  p-1 rounded-md cursor-pointer 
                                 ${showGroupOptions && groupOptionsId === groupId ? `bg-sky-200 text-inherit` : `hover:bg-slate-300 text-white`}`}
                                 onClick={() => {
                                    setShowGroupOptions(true)
                                    setGroupOptionsId(groupId)
                                    setRenderGroups(!renderGroups)
                                }}>
                                <BsThreeDots />
                                {(showGroupOptions && groupOptionsId === groupId) && 
                                    <div ref={groupOptionsId === groupId ? groupOptionsRef : null}
                                        className="absolute left-7 top-0 bg-white z-10 shadow-all-sides w-60 text-slate-600 text-sm p-2 rounded-lg">
                                        <div className="group-options-button" onClick={() => deleteGroup(groupId)}>
                                            <FiTrash className="mx-2 my-1"/>
                                            <p>Delete</p>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className={`flex items-center gap-1 group ${isEditingGroupName && `w-full`} w-fit relative`}>
                                <input type="text" 
                                className="text-lg border px-1 py-0 text-center rounded-md border-transparent hover:border-slate-300 focus:outline-none focus:border-sky-600 focus:min-w-[70%] focus:text-start peer" 
                                value={(isEditingGroupName && editingGroupId === groupId) ? editingGroupName : currentGroup.name} 
                                ref={(el) => el && groupInputRef.current.push(el)}
                                onFocus={(e) => {
                                    setEditingGroupName(e.target.value)
                                    setEditingGroupId(groupId)
                                    setIsEditingGroupName(true)
                                    setRenderGroups(!renderGroups)
                                }}
                                onChange={(e) => {
                                    setEditingGroupName(e.target.value)
                                    setRenderGroups(!renderGroups)
                                    }}
                                onBlur={() => {
                                    setIsEditingGroupName(false)
                                    setEditingGroupName('')
                                    editGroupName(groupId)
                                    setRenderGroups(!renderGroups)
                                }}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter') {
                                        e.target.blur()
                                        setIsEditingGroupName(false)
                                        setEditingGroupName('')
                                        editGroupName(groupId)
                                    }
                                }}/>
                                {!isEditingGroupName && 
                                    <div 
                                        className="absolute scale-0 justify-center bg-slate-700 py-[7px] px-4 rounded-md bottom-10 z-10 min-w-28
                                                peer-hover:flex peer-hover:scale-100 transition ease-in duration-0 peer-hover:duration-100 peer-hover:delay-500">
                                        <p className="bg-slate-700 text-white m-0 text-sm">Click to Edit</p>
                                        <div className="text-slate-700 absolute top-[25px] text-2xl">
                                            <GoTriangleDown/>
                                        </div>
                                    </div>
                                }
                                <p className={`transition ease-in group-hover:text-slate-400 text-sm text-white w-fit peer-focus:hidden `}>{currentGroupsItems.length} Items</p>
                                {/* hidden span to measure the length of the input so we can manually set the width */}
                                <span ref={(el) => el && measureGroupInputRef.current.push(el)} className="text-lg p-1 px-2 invisible absolute min-w-3"></span>
                            </div>
                        </div>
                        <div className="border border-slate-300 rounded-md border-r-0 border-l-0 rounded-r-none">
                            <div className="w-1/3 border-r border-r-slate-300 flex bg-white">
                                <div className="bg-black w-[6px] justify-self-start rounded-tl-md"></div>
                                <div className="p-2 flex items-center border-r border-r-slate-300">
                                    <div className={`w-4 h-4 border border-slate-300 hover:border-slate-600 cursor-pointer rounded-sm 
                                        ${groupsAllSelected.includes(groupId) ? `bg-sky-600` : `bg-white`}`} 
                                        onClick={() => selectAllItems(groupId)}>
                                            { groupsAllSelected.includes(groupId) && 
                                                <FaCheck color="white" className="h-4/5 w-4/5 mx-auto my-[1px]"/>
                                            }
                                    </div>
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

                if (!editingGroupName) {
                    adjustGroupNameWidth(i)
                }
            }

            setGroupHtml(tempGroupHtml)

            if (reloadGroupsInitial) {
                setRenderGroups(!renderGroups)
                setReloadGroupsInitial(false)
            }

            groupInputRef.current = []
            measureGroupInputRef.current = []
        }
    }, [renderGroups])

    // this is so we can change the group name's input's width dynamically, will fit the width 
    function adjustGroupNameWidth(index) {
        if (groupInputRef.current[index] && measureGroupInputRef.current[index]) {
            measureGroupInputRef.current[index].textContent = groupInputRef.current[index].value
            groupInputRef.current[index].style.width = `${measureGroupInputRef.current[index].offsetWidth }px`
        }
    }

    function selectAllItems(groupId) {
        let amountSelected = 0
        for (let i=0; i < groupsData.itemsInfo.length; i++) {
            // go through items, if they match the group that was clicked to select all items, they'll be added to selected items
            if (groupsData.itemsInfo[i].length != 0 && groupsData.itemsInfo[i][0].group === groupId) {
                let allItemsSelected = true
                let itemsInTheGroup = []
                for (let j=0; j<groupsData.itemsInfo[i].length; j++) {
                    itemsInTheGroup.push(groupsData.itemsInfo[i][j].id)
                    if (!itemSelected.includes(groupsData.itemsInfo[i][j].id)) {
                        setItemSelected(oldArr => [...oldArr, groupsData.itemsInfo[i][j].id])
                        amountSelected += 1
                        allItemsSelected = false
                    }
                }
                // if in the group, all the items were already selected, deselect all of the items
                if (allItemsSelected) {
                    let tempItemSelected = itemSelected
                    // so we don't have issues with the for loop while removing elements
                    let newItemSelected = []

                    let groupIndex = groupsAllSelected.indexOf(groupId)
                    let tempGroupsAllSelected = [...groupsAllSelected]

                    tempGroupsAllSelected.splice(groupIndex, 1)
                    setGroupsAllSelected(tempGroupsAllSelected)

                    for (let k=0; k<tempItemSelected.length; k++) {
                        if (!itemsInTheGroup.includes(tempItemSelected[k])) {
                            newItemSelected.push(tempItemSelected[k])
                        }
                        else {
                            amountSelected -= 1
                        }
                    }

                    setItemSelected(newItemSelected)
                }

                else {
                setGroupsAllSelected(oldArr => [...oldArr, groupId])
                }
                setRenderGroups(!renderGroups)
                setIsItemSelected(true)
                setNumberOfItemsSelected(itemSelected.length + amountSelected)
                return
            }
        }
    }

    function handleItemSelect(groupIndex, itemIndex) {
        let tempItemSelected = itemSelected
        let itemId = groupsData.itemsInfo[groupIndex][itemIndex].id
        if (tempItemSelected.includes(itemId)) {
            for (let i=0; i<tempItemSelected.length; i++) {
                if (tempItemSelected[i] === itemId) {
                    tempItemSelected.splice(i, 1)
                }
            }
            if (tempItemSelected.length === 0) {
                setIsItemSelected(false)
            }
            // removes the group so it doesn't show the entire group is selected anymore, if it was.
            let groupId = groupsData.itemsInfo[groupIndex][itemIndex].group
            if (groupsAllSelected.includes(groupId)) {
                let index = groupsAllSelected.indexOf(groupId)
                groupsAllSelected.splice(index, 1)
            }
            setNumberOfItemsSelected(tempItemSelected.length)
            setItemSelected(tempItemSelected)
        }
        else {
            setNumberOfItemsSelected(itemSelected.length + 1)
            setItemSelected(oldArr => [...oldArr, itemId])
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

    function deleteGroup(groupId) {
        fetch('http://127.0.0.1:8000/board/delete-group/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`,
            },
            body: JSON.stringify({
                group_id: groupId
            })
        })
        .then(res => res.json())
        .then(data => setRenderComponent(!renderComponent))
    }

    function editGroupName(groupId) {
        fetch('http://127.0.0.1:8000/board/edit-group-name/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                group_name: editingGroupName,
                group_id: groupId
            })
        })
        .then(res => res.json())
        .then(data => {
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
        <div className="bg-white rounded-tl-lg relative flex flex-col overflow-auto h-full custom-scrollbar">
            <div className="ml-10 mb-5 mr-1">
                <div className="sticky top-0 bg-white z-10 py-5">
                    <p className="text-2xl hover:bg-slate-100 w-fit p-1 py-0 rounded-md cursor-pointer">{boardTitle}</p>
                    <button onClick={() => createItemButton()} className="bg-sky-600 p-[6px] px-4 rounded-sm text-white text-sm hover:bg-sky-700 mt-5">New item</button>
                </div>
                <div>
                    {groupHtml &&
                            groupHtml
                    }
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