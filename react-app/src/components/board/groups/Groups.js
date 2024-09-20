import { useEffect, useState, useRef } from "react"
import GroupOptions from "./GroupOptions";
import Items from "../items/Items";
import { FaCheck } from "react-icons/fa6";
import { FiTrash } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import AddColumn from "../columns/AddColumn"
import GroupNameInput from "./GroupNameInput";


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

        if (columnOptionsSelectedRef.current && !columnOptionsSelectedRef.current.contains(e.target)) {
            setColumnOptionsSelectedId('')
            props.setRenderGroups(!props.renderGroups)
        }
    }

     // renders all the groups in a separate use effect than the fetch
     useEffect(() => {
        if (groupsData) {
            let tempGroupHtml = []


            // set the group html
            for (let i=0; i<groupsData.groupsInfo.length; i++) {
                let currentGroup = groupsData.groupsInfo[i]  
                let groupId = currentGroup.id
                let currentGroupsItems = groupsData.itemsInfo[i]

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

                            <GroupOptions groupId={groupId} userToken={props.userToken} renderComponent={props.renderComponent} setRenderComponent={props.setRenderComponent}
                                          renderGroups={props.renderGroups} setRenderGroups={props.setRenderGroups} boardId={props.boardId}/>

                            <GroupNameInput groupId={groupId} userToken={props.userToken} renderComponent={props.renderComponent} setRenderComponent={props.setRenderComponent}
                                           renderGroups={props.renderGroups} setRenderGroups={props.setRenderGroups} currentGroup={currentGroup} i={i}
                                           currentGroupsItems={currentGroupsItems} boardId={props.boardId}/>

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

                                <Items isItemSelected={props.isItemSelected} setIsItemSelected={props.setIsItemSelected} itemSelected={props.itemSelected} setItemSelected={props.setItemSelected}
                                groupsData={groupsData} i={i} currentGroup={currentGroup} renderComponent={props.renderComponent} setRenderComponent={props.setRenderComponent}
                                renderGroups={props.renderGroups} setRenderGroups={props.setRenderGroups} numberOfItemsSelected={props.numberOfItemsSelected} 
                                setNumberOfItemsSelected={props.setNumberOfItemsSelected}/>

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
            }
            
            setGroupHtml(tempGroupHtml)
            if (props.reloadGroupsInitial) {
                props.setRenderGroups(!props.renderGroups)
                props.setReloadGroupsInitial(false)
            }

            columnNameRefs.current = []
            measureColumnNamesRefs.current = []
        }
    }, [props.renderGroups])   
    
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

    return (
        <>
            {groupHtml &&
                groupHtml
            }
        </>
    )
}


export default Groups