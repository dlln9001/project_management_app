import { useEffect, useState, useRef } from "react"
import GroupColors from "./GroupColors";
import { GoTriangleUp } from "react-icons/go";
import { FaCheck } from "react-icons/fa6";
import { FiTrash } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { GoTriangleDown } from "react-icons/go";
import AddColumn from "../columns/AddColumn"

export function createItem(groupId, addItemContent, setAddItemContent='', boardId, userToken, renderComponent, setRenderComponent, renderGroups, setRenderGroups) {
    if (addItemContent) {
        fetch('http://127.0.0.1:8000/board/create-item/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                group_id: groupId,
                name: addItemContent,
                board_id: boardId
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
    if (setAddItemContent) {
        setAddItemContent('')
    }
    setRenderGroups(!renderGroups)

}


function Groups(props) {
    let groupsData = props.groupsData
    const [groupHtml, setGroupHtml] = useState('')

    const [addItemContent, setAddItemContent] = useState('')
    const [focusedAddItem, setFocusedAddItem] = useState('')

    const [focusedItem, setFocusedItem] = useState([])
    const [editingItemContents, setEditingItemContents] = useState('')

    const groupInputRef = useRef([])
    const measureGroupInputRef = useRef([])
    
    const [editingGroupName, setEditingGroupName] = useState('')
    const [editingGroupId, setEditingGroupId] = useState('')
    const [isEditingGroupName, setIsEditingGroupName] = useState(false)

    const [showGroupOptions, setShowGroupOptions] = useState(false)
    const [groupOptionsId, setGroupOptionsId] = useState('') // id of the group
    const groupOptionsRef = useRef('')

    const [setColumnValueItemId, setSetColumnValueItemId] = useState('')
    const setColumnValueRef = useRef('')

    const [columnOptionsSelectedId, setColumnOptionsSelectedId] = useState('')
    const columnOptionsSelectedRef = useRef('')
    const columnNameRefs = useRef([])
    const measureColumnNamesRefs = useRef([])
    const [columnEditingName, setColumnEditingName] = useState('')
    const [columnNameEdited, setColumnNameEdited] = useState(false)
    const [columnNameEditedIndexes, setColumnNameEditedIndexes] = useState('')
    const [columnNameFocused, setColumnNameFocused] = useState(false)

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)
    }, [])

    function handleDocumentClick(e) {
        // closes out the group options
        if (groupOptionsRef.current && !groupOptionsRef.current.contains(e.target)) {
            setShowGroupOptions(false)
            setGroupOptionsId('')
            props.setRenderGroups(!props.renderGroups)
        }

        if (setColumnValueRef.current && !setColumnValueRef.current.contains(e.target)) {
            setSetColumnValueItemId('')
            props.setRenderGroups(!props.renderGroups)
        }

        if (columnOptionsSelectedRef.current && !columnOptionsSelectedRef.current.contains(e.target)) {
            setColumnOptionsSelectedId('')
            props.setRenderGroups(!props.renderGroups)
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
                let currentGroup = groupsData.groupsInfo[i]
                for (let j=0; j<groupsData.itemsInfo[i].length; j++) {
                    let columnValues = groupsData.columnValues[i][j]
                    let columnValuesHtml = []
                    // currently not tied to the columns, only items
                    // set columnValues html for each item
                    for (let k=0; k<columnValues.length; k++) {
                        columnValuesHtml.push(
                            <div key={k} className={`${columnValues[k].value_color} min-w-36  cursor-pointer flex relative justify-center items-center
                                  text-white 
                                  ${(setColumnValueItemId[0] === i && setColumnValueItemId[1] === j && setColumnValueItemId[2] === k) 
                                    ? `border border-sky-600` 
                                    : `border-t border-t-slate-300 border-r border-r-slate-300`}`}
                                onClick={() => {
                                        setSetColumnValueItemId([i, j, k])
                                        props.setRenderGroups(!props.renderGroups)
                                }}>
                                <p>{columnValues[k].value_text}</p>
                                {/* set labels menu */}
                                {(setColumnValueItemId[0] === i && setColumnValueItemId[1] === j && setColumnValueItemId[2] === k) && 
                                    <div className="absolute bg-white z-10 top-9 flex flex-col items-center p-6 w-48 shadow-all-sides rounded-md text-center gap-2 cursor-default"
                                        ref={setColumnValueRef}>
                                        <GoTriangleUp className="absolute bottom-[189px] text-white text-3xl"/>
                                        <div className="w-full bg-green-500 text-white p-[6px] rounded-sm cursor-pointer" 
                                             onClick={() => editColumnValue(columnValues[k].id, 'bg-green-500', 'Done')}>Done</div>
                                        <div className="w-full bg-orange-300 text-white p-[6px] rounded-sm cursor-pointer"
                                             onClick={() => editColumnValue(columnValues[k].id, 'bg-orange-300', 'Working on it')}>Working on it</div>
                                        <div className="w-full bg-red-500 text-white p-[6px] rounded-sm cursor-pointer"
                                             onClick={() => editColumnValue(columnValues[k].id, 'bg-red-500', 'Stuck')}>Stuck</div>
                                        <div className="w-full bg-neutral-400 text-white p-[6px] rounded-sm min-h-[32px] cursor-pointer"
                                             onClick={() => editColumnValue(columnValues[k].id, 'bg-neutral-400', '')}></div>
                                    </div>
                                }
                            </div>
                        )
                    }
                    if (props.itemSelected.includes(groupsData.itemsInfo[i][j].id)) {
                        itemIdCheck = true
                    }
                    itemHtml.push(
                        <div key={j} className=" w-full text-sm text-slate-600 hover:bg-slate-100 flex">
                                {/* here allows for selecting icons */}
                                <div className={`${currentGroup.color} w-[6px] justify-self-start min-w-[6px]`}></div>
                                <div className="p-2 flex items-center border-r border-r-slate-300 border-t border-t-slate-300">
                                    <div className={`w-4 h-4 border  cursor-pointer rounded-sm
                                         ${props.itemSelected.includes(groupsData.itemsInfo[i][j].id) ? `bg-sky-600 hover:bg-sky-700` : `bg-white border-slate-300 hover:border-slate-600`}`}
                                         onClick={() => handleItemSelect(i, j)}
                                    >
                                        {props.itemSelected.includes(groupsData.itemsInfo[i][j].id) && 
                                            <FaCheck color="white" className="h-4/5 w-4/5 mx-auto my-[1px]"/>
                                        }
                                    </div>
                                </div>
                            {/* this is where the user inputs the item content */}
                            <div className="px-2 border-t flex border-t-slate-300 min-w-[33%] border-r border-r-slate-300">
                                <input type="text" 
                                    onFocus={() => {
                                        setFocusedItem([i, j])
                                        setEditingItemContents(groupsData.itemsInfo[i][j].name)
                                        props.setRenderGroups(!props.renderGroups)
                                    }}
                                    onBlur={(e) => editItem(e.target.value, groupsData.itemsInfo[i][j].id)}
                                    onChange={(e) => {
                                        setEditingItemContents(e.target.value)
                                        props.setRenderGroups(!props.renderGroups)
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
                            {columnValuesHtml}
                            <div className=" w-full border-t border-t-slate-300"></div>
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
                props.setIsItemSelected(false)
                props.setItemSelected([])
            }

            // set the group html
            for (let i=0; i<groupsData.groupsInfo.length; i++) {
                let currentGroup = groupsData.groupsInfo[i]  
                let groupId = currentGroup.id
                let currentGroupsItems = groupsData.itemsInfo[i]

                let groupNameTextColor = currentGroup.color.replace('bg', 'text')

                // set the column type html. In the group for loop so it can know which group it is on to open column options on the right group
                let columnHtml = []
                for (let j=0; j<groupsData.columnsInfo.length; j++) {
                    columnHtml.push(
                        <div key={j} className={`min-w-36 text-sm border-r border-r-slate-300 flex justify-center items-center text-slate-600  relative group max-w-20
                            ${(columnOptionsSelectedId[0] === groupsData.columnsInfo[j].id && columnOptionsSelectedId[1] === i)
                                ? `bg-slate-100`
                                : `hover:bg-slate-100`
                            }`}>
                            <div className={`${(columnNameFocused && columnNameEditedIndexes[0] === groupsData.columnsInfo[j].id && columnNameEditedIndexes[1] === i)
                                    ? `border border-sky-600 w-10/12 mx-2`
                                    : `hover:border-slate-400 border border-white max-w-10/12`
                                    }   bg-white max-w-10/12 w-7/12`}>
                                <input type="text" 
                                className={` focus:outline-none max-w-full text-center focus:text-start text-ellipsis`}
                                value={(columnNameEdited && columnNameEditedIndexes[0] === groupsData.columnsInfo[j].id && columnNameEditedIndexes[1] === i)
                                ? columnEditingName 
                                : groupsData.columnsInfo[j].name
                                } 
                                onChange={(e) => {
                                        setColumnEditingName(e.target.value)
                                        setColumnNameEdited(true)
                                        props.setRenderGroups(!props.renderGroups)
                                    }}
                                onFocus={() => {
                                    setColumnNameFocused(true)
                                    setColumnNameEditedIndexes([groupsData.columnsInfo[j].id, i])
                                    props.setRenderGroups(!props.renderGroups)
                                }}
                                onBlur={(e) => {
                                    setColumnNameFocused(false)
                                    setColumnNameEditedIndexes([])
                                    editColumnName(e.target.value, groupsData.columnsInfo[j].id)
                                    props.setRenderGroups(!props.renderGroups)
                                }}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter') {
                                        e.target.blur()
                                        editColumnName(e.target.value, groupsData.columnsInfo[j].id)
                                    }
                                }}
                                ref={(el) => el && columnNameRefs.current.push(el)}/>
                            </div>
                             <span ref={(el) => el && measureColumnNamesRefs.current.push(el)} className="text-lg p-1 px-2 invisible absolute min-w-3"></span>
                             {!columnNameFocused && 
                                <div className={`absolute right-0 mr-2  p-1 rounded-[4px] cursor-pointer  
                                    ${(columnOptionsSelectedId[0] === groupsData.columnsInfo[j].id && columnOptionsSelectedId[1] === i) 
                                        ? `text-slate-600 bg-sky-100` 
                                        : `group-hover:text-inherit hover:bg-slate-200 text-white`}`}
                                    onClick={() => {
                                    setColumnOptionsSelectedId([groupsData.columnsInfo[j].id, i])
                                    props.setRenderGroups(!props.renderGroups)
                                }}>
                                    <BsThreeDots />
                                {(columnOptionsSelectedId[0] === groupsData.columnsInfo[j].id && columnOptionsSelectedId[1]) === i &&
                                    <div ref={columnOptionsSelectedRef} className="absolute bg-white shadow-all-sides rounded-md w-48 z-10 left-7 top-0 text-slate-700">
                                        <div className="flex px-2 py-1 hover:bg-slate-100 m-2 rounded-md cursor-pointer" onClick={() => deleteColumn(groupsData.columnsInfo[j].id)}>
                                            <FiTrash className="mx-2 my-1"/>
                                            <p>Delete</p>
                                        </div>
                                    </div>
                                }
                                </div>
                             }
                        </div>
                    )

                    resizeInput(i, columnNameRefs, measureColumnNamesRefs)
                }


                tempGroupHtml.push(
                    <div key={i} className="mt-10">
                        <div className="flex items-center mb-2 group">
                            <div className={`absolute left-3 group-hover:text-inherit  p-1 rounded-md cursor-pointer 
                                 ${showGroupOptions && groupOptionsId === groupId ? `bg-sky-200 text-inherit` : `hover:bg-slate-300 text-white`}`}
                                 onClick={() => {
                                    setShowGroupOptions(true)
                                    setGroupOptionsId(groupId)
                                    props.setRenderGroups(!props.renderGroups)
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

                                {/* for color options */}
                                {(isEditingGroupName && editingGroupId === groupId) && 
                                    <GroupColors groupId={groupId} userToken={props.userToken} renderComponent={props.renderComponent} setRenderComponent={props.setRenderComponent}
                                            renderGroups={props.renderGroups} setRenderGroups={props.setRenderGroups} currentGroup={currentGroup}/>
                                }

                                <input type="text" 
                                className={`text-lg border px-1 py-0 text-center rounded-[4px] border-transparent hover:border-slate-300 focus:outline-none focus:border-sky-600 focus:min-w-[70%] 
                                           focus:text-start peer ${(isEditingGroupName && editingGroupId === groupId) && `pl-8`} ${groupNameTextColor} font-medium`}
                                value={(isEditingGroupName && editingGroupId === groupId) ? editingGroupName : currentGroup.name} 
                                ref={(el) => el && groupInputRef.current.push(el)}
                                onFocus={(e) => {
                                    setEditingGroupName(e.target.value)
                                    setEditingGroupId(groupId)
                                    setIsEditingGroupName(true)
                                    props.setRenderGroups(!props.renderGroups)
                                }}
                                onChange={(e) => {
                                    setEditingGroupName(e.target.value)
                                    props.setRenderGroups(!props.renderGroups)
                                    }}
                                onBlur={() => {
                                    setIsEditingGroupName(false)
                                    setEditingGroupName('')
                                    editGroupName(groupId)
                                    props.setRenderGroups(!props.renderGroups)
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
                                        className="absolute scale-0 justify-center bg-slate-700 py-[7px] px-4 rounded-md bottom-10 z-10 min-w-28 shadow-lg
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
                            <div className="w-full flex bg-white">
                                <div className={`${currentGroup.color} min-w-[6px] justify-self-start rounded-tl-md`}></div>
                                <div className="p-2 flex items-center border-r border-r-slate-300">
                                    <div className={`w-4 h-4 border border-slate-300 hover:border-slate-600 cursor-pointer rounded-sm 
                                        ${props.groupsAllSelected.includes(groupId) ? `bg-sky-600` : `bg-white`}`} 
                                        onClick={() => selectAllItems(groupId)}>
                                            { props.groupsAllSelected.includes(groupId) && 
                                                <FaCheck color="white" className="h-4/5 w-4/5 mx-auto my-[1px]"/>
                                            }
                                    </div>
                                </div>
                                <div className="min-w-[33%] px-2 border-r border-r-slate-300 flex items-center justify-center">
                                    <p className="text-sm text-slate-600 self-center  text-center">Item</p>
                                </div>

                                {columnHtml}

                                <AddColumn userToken={props.userToken} boardId={props.boardId} groupId={groupId} renderComponent={props.renderComponent} setRenderComponent={props.setRenderComponent}
                                        renderGroups={props.renderGroups} setRenderGroups={props.setRenderGroups}/>

                                <div className="w-full"></div>
                            </div>

                                {itemsHtml[i]}

                            {/* Add Item */}
                            <div className={`flex`}>
                                <div className={`${currentGroup.color} w-[6px] justify-self-start rounded-bl-md opacity-50`}></div>
                                <div className="p-2 flex items-center border-r border-r-slate-300 border-t border-t-slate-300">
                                    <div className="w-4 h-4 border border-slate-200 rounded-sm"></div>
                                </div>
                                <div className="w-full flex items-center pl-2 border-t border-t-slate-300">
                                    <input type="text" placeholder="+ Add item"   
                                    className="w-1/5 border border-white text-sm pl-5 focus:outline-none hover:border-slate-200 hover:border rounded-sm
                                    focus:border-sky-600 text-slate-600 h-fit"
                                    onFocus={() => addItemFocus(i)}
                                    value={focusedAddItem === i ? addItemContent : ''}
                                    onChange={(e) => changeFocusedAddItem(e.target.value)}
                                    onBlur={() => createItem(groupId, addItemContent, setAddItemContent, props.boardId, props.userToken, props.renderComponent, props.setRenderComponent, props.renderGroups, props.setRenderGroups)}
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

            if (props.reloadGroupsInitial) {
                props.setRenderGroups(!props.renderGroups)
                props.setReloadGroupsInitial(false)
            }

            groupInputRef.current = []
            measureGroupInputRef.current = []
            columnNameRefs.current = []
            measureColumnNamesRefs.current = []
        }
    }, [props.renderGroups])   

        // this is so we can change the group name's input's width dynamically, will fit the width 
        function adjustGroupNameWidth(index) {
            if (groupInputRef.current[index] && measureGroupInputRef.current[index]) {
                measureGroupInputRef.current[index].textContent = groupInputRef.current[index].value
                groupInputRef.current[index].style.width = `${measureGroupInputRef.current[index].offsetWidth + 10}px`
            }
        }
    
        function resizeInput(index, inputRefs, measureInputRefs) {
            if (inputRefs.current[index] && measureInputRefs.current[index]) {
                measureInputRefs.current[index].textContent = inputRefs.current[index].value
                inputRefs.current[index].style.width = `${measureInputRefs.current[index].offsetWidth + 5}px`
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
                        if (!props.itemSelected.includes(groupsData.itemsInfo[i][j].id)) {
                            props.setItemSelected(oldArr => [...oldArr, groupsData.itemsInfo[i][j].id])
                            amountSelected += 1
                            allItemsSelected = false
                        }
                    }
                    // if in the group, all the items were already selected, deselect all of the items
                    if (allItemsSelected) {
                        let tempItemSelected = props.itemSelected
                        // so we don't have issues with the for loop while removing elements
                        let newItemSelected = []
    
                        let groupIndex = props.groupsAllSelected.indexOf(groupId)
                        let tempGroupsAllSelected = [...props.groupsAllSelected]
    
                        tempGroupsAllSelected.splice(groupIndex, 1)
                        props.setGroupsAllSelected(tempGroupsAllSelected)
    
                        for (let k=0; k<tempItemSelected.length; k++) {
                            if (!itemsInTheGroup.includes(tempItemSelected[k])) {
                                newItemSelected.push(tempItemSelected[k])
                            }
                            else {
                                amountSelected -= 1
                            }
                        }
    
                        props.setItemSelected(newItemSelected)
                    }
    
                    else {
                    props.setGroupsAllSelected(oldArr => [...oldArr, groupId])
                    }
                    props.setRenderGroups(!props.renderGroups)
                    props.setIsItemSelected(true)
                    props.setNumberOfItemsSelected(props.itemSelected.length + amountSelected)
                    return
                }
            }
        }
    
        function handleItemSelect(groupIndex, itemIndex) {
            let tempItemSelected = props.itemSelected
            let itemId = groupsData.itemsInfo[groupIndex][itemIndex].id
            if (tempItemSelected.includes(itemId)) {
                for (let i=0; i<tempItemSelected.length; i++) {
                    if (tempItemSelected[i] === itemId) {
                        tempItemSelected.splice(i, 1)
                    }
                }
                if (tempItemSelected.length === 0) {
                    props.setIsItemSelected(false)
                }
                // removes the group so it doesn't show the entire group is selected anymore, if it was.
                let groupId = groupsData.itemsInfo[groupIndex][itemIndex].group
                if (props.groupsAllSelected.includes(groupId)) {
                    let index = props.groupsAllSelected.indexOf(groupId)
                    props.groupsAllSelected.splice(index, 1)
                }
                props.setNumberOfItemsSelected(tempItemSelected.length)
                props.setItemSelected(tempItemSelected)
            }
            else {
                props.setNumberOfItemsSelected(props.itemSelected.length + 1)
                props.setItemSelected(oldArr => [...oldArr, itemId])
                props.setIsItemSelected(true)
            }
            props.setRenderGroups(!props.renderGroups)
        }
    
        function editItem(itemContent, itemId) {
            fetch('http://127.0.0.1:8000/board/edit-item/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.userToken}`
                },
                body: JSON.stringify({
                    item_id: itemId,
                    item_name: itemContent,
                })
            })
            .then(res => res.json())
            .then(data => props.setRenderComponent(!props.renderComponent))
        }
    
        function enterAddItem(e, groupId, addItemContent) {
            if (e.key === 'Enter') {
                createItem(groupId, addItemContent, setAddItemContent, props.boardId, props.userToken, props.renderComponent, props.setRenderComponent, props.renderGroups, props.setRenderGroups)
            }
        }
    
        function changeFocusedAddItem(value) {
            setAddItemContent(value)
            props.setRenderGroups(!props.renderGroups)
        }
    
        function addItemFocus(i) {
            setFocusedAddItem(i)
            props.setRenderGroups(!props.renderGroups)
        }


    
        function deleteGroup(groupId) {
            fetch('http://127.0.0.1:8000/board/delete-group/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.userToken}`,
                },
                body: JSON.stringify({
                    group_id: groupId,
                    board_id: props.boardId
                })
            })
            .then(res => res.json())
            .then(data => props.setRenderComponent(!props.renderComponent))
        }
    
        function editGroupName(groupId) {
            fetch('http://127.0.0.1:8000/board/edit-group-name/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.userToken}`
                },
                body: JSON.stringify({
                    group_name: editingGroupName,
                    group_id: groupId
                })
            })
            .then(res => res.json())
            .then(data => {
                props.setRenderComponent(!props.renderComponent)
            })
        }
        
        function deleteColumn(columnId) {
            fetch('http://127.0.0.1:8000/board/delete-column/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.userToken}`
                },
                body: JSON.stringify({
                    column_id: columnId,
                    board_id: props.boardId
                })
            })
            .then(res => res.json())
            .then(data => {
                setColumnOptionsSelectedId('')
                props.setRenderComponent(!props.renderComponent)
            })
        }
    
        function editColumnName(columnName, columnId) {
            fetch('http://127.0.0.1:8000/board/edit-column-name/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.userToken}`
                },
                body: JSON.stringify({
                    column_id: columnId,
                    column_name: columnName
                })
            })
            .then(res => res.json())
            .then(data => props.setRenderComponent(!props.renderComponent))
        }
    
        function editColumnValue(columnValueId, color, text) {
            fetch('http://127.0.0.1:8000/board/edit-column-value/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.userToken}`
                },
                body: JSON.stringify({
                    column_value_id: columnValueId,
                    color: color,
                    text: text
                })
            })
            .then(res => res.json())
            .then(data => {
                setSetColumnValueItemId('')
                props.setRenderComponent(!props.renderComponent)
            })
        }

    return (
        <div>
            {groupHtml &&
                groupHtml
            }
        </div>
    )
}


export default Groups