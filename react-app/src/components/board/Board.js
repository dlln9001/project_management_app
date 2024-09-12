import React, { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import BoardInfo from "./BoardInfo";
import { useLocation } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { FaCheck } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs";
import { FiTrash } from "react-icons/fi";
import { IoIosAdd } from "react-icons/io";


function Board(props) {
    const { renderSideBar, setRenderSideBar } = useOutletContext()
    
    const userToken = JSON.parse(localStorage.getItem('userToken'))
    const query = new URLSearchParams(useLocation().search)

    const [boardTitle, setBoardTitle] = useState('')
    const boardId = query.get('id')
    const [boardInfo, setBoardInfo] = useState('')

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
    const [groupOptionsId, setGroupOptionsId] = useState('') // id of the group
    const groupOptionsRef = useRef('')

    const [showColorOptions, setShowColorOptions] = useState(false)
    const [colorOptionsHtml, setColorOptionsHtml] = useState('')
    const colorOptions = ['bg-emerald-600', 'bg-green-500', 'bg-lime-500', 'bg-yellow-500', 'bg-amber-400', 'bg-violet-600', 'bg-purple-500', 'bg-blue-500', 'bg-sky-400', 
                         'bg-cyan-300', 'bg-rose-700', 'bg-red-500', 'bg-pink-600', 'bg-pink-300', 'bg-orange-600', 'bg-amber-500', 'bg-yellow-800', 'bg-gray-300', 
                         'bg-gray-500', 'bg-slate-600']
    
    const [showAddColumns, setShowAddColumn] = useState(false)
    const [addColumnsId, setAddColumnsId] = useState('')
    const addColumnsRef = useRef('')

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
            console.log(data.boardInfo)
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

        if (addColumnsRef.current && !addColumnsRef.current.contains(e.target)) {
            setShowAddColumn(false)
            setAddColumnsId('')
            setRenderGroups(!renderGroups)
        }

        if (setColumnValueRef.current && !setColumnValueRef.current.contains(e.target)) {
            setSetColumnValueItemId('')
            setRenderGroups(!renderGroups)
        }

        if (columnOptionsSelectedRef.current && !columnOptionsSelectedRef.current.contains(e.target)) {
            setColumnOptionsSelectedId('')
            setRenderGroups(!renderGroups)
        }

        if (boardInfoRef.current && !boardInfoRef.current.contains(e.target) && !boardTitleRef.current.contains(e.target)) {
            setShowBoardInfo(false)
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
                                        setRenderGroups(!renderGroups)
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
                    if (itemSelected.includes(groupsData.itemsInfo[i][j].id)) {
                        itemIdCheck = true
                    }
                    itemHtml.push(
                        <div key={j} className=" w-full text-sm text-slate-600 hover:bg-slate-100 flex">
                                {/* here allows for selecting icons */}
                                <div className={`${currentGroup.color} w-[6px] justify-self-start min-w-[6px]`}></div>
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
                            {/* this is where the user inputs the item content */}
                            <div className="px-2 border-t flex border-t-slate-300 min-w-[33%] border-r border-r-slate-300">
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
                setIsItemSelected(false)
                setItemSelected([])
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
                                        setRenderGroups(!renderGroups)
                                    }}
                                onFocus={() => {
                                    setColumnNameFocused(true)
                                    setColumnNameEditedIndexes([groupsData.columnsInfo[j].id, i])
                                    setRenderGroups(!renderGroups)
                                }}
                                onBlur={(e) => {
                                    setColumnNameFocused(false)
                                    setColumnNameEditedIndexes([])
                                    editColumnName(e.target.value, groupsData.columnsInfo[j].id)
                                    setRenderGroups(!renderGroups)
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
                                    setRenderGroups(!renderGroups)
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
                                {/* for color options */}
                                {(isEditingGroupName && editingGroupId === groupId) && 
                                   <>
                                   <div className={`absolute w-[15px] h-[15px] rounded-[4px] left-2 cursor-pointer ${currentGroup.color} hover:opacity-80`} onMouseDown={(e) => {
                                        e.preventDefault()
                                        setShowColorOptions(true)
                                        createColorOptionsHtml(groupId)
                                        setRenderGroups(!renderGroups)
                                    }}>
                                    </div>
                                   {showColorOptions &&
                                        <div className="absolute top-9 bg-white border border-slate-300 rounded-[5px] flex p-1 gap-[1px] flex-wrap w-[164px] z-10"
                                            onMouseDown={(e) => e.preventDefault()}>
                                            {colorOptionsHtml}
                                        </div>
                                   }
                                   </>
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
                                    setRenderGroups(!renderGroups)
                                }}
                                onChange={(e) => {
                                    setEditingGroupName(e.target.value)
                                    setRenderGroups(!renderGroups)
                                    }}
                                onBlur={() => {
                                    setShowColorOptions(false)
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
                                        ${groupsAllSelected.includes(groupId) ? `bg-sky-600` : `bg-white`}`} 
                                        onClick={() => selectAllItems(groupId)}>
                                            { groupsAllSelected.includes(groupId) && 
                                                <FaCheck color="white" className="h-4/5 w-4/5 mx-auto my-[1px]"/>
                                            }
                                    </div>
                                </div>
                                <div className="min-w-[33%] px-2 border-r border-r-slate-300 flex items-center justify-center">
                                    <p className="text-sm text-slate-600 self-center  text-center">Item</p>
                                </div>

                                {columnHtml}

                                <div className="text-2xl flex items-center justify-center mx-1 h-fit self-center group relative" 
                                    onClick={() => {
                                        setShowAddColumn(true)
                                        setAddColumnsId(groupId)
                                        setRenderGroups(!renderGroups)
                                    }}>
                                    {(showAddColumns && addColumnsId === groupId) && 
                                        // this is the menu to add different columns
                                        <div className="absolute text-sm w-80 bg-white shadow-all-sides p-6 rounded-md right-[26px] top-0 z-10"
                                            ref={addColumnsRef}>
                                            <p className="text-slate-500 mb-1 p-1">Essentials</p>
                                            <div className="hover:bg-slate-100 rounded-md p-2 cursor-pointer flex items-center gap-2"
                                                 onClick={() => addColumn('Status')}>
                                                <img src={process.env.PUBLIC_URL + 'images/statusColumn.png'} alt="" className="w-[7%] h-fit rounded-sm" />
                                                <p>Status</p>
                                            </div>
                                        </div>
                                    }
                                    <IoIosAdd className={`hover:bg-slate-100   rounded-sm cursor-pointer peer 
                                            ${(showAddColumns && addColumnsId === groupId) ? `bg-slate-100 text-sky-600` : `text-slate-500 hover:text-slate-700`}`}/>
                                    <div 
                                        className={`absolute scale-0 justify-center bg-slate-700 py-[7px] px-4 rounded-md z-10 min-w-28 bottom-10 shadow-lg
                                                peer-hover:flex peer-hover:scale-100 transition ease-in duration-0 peer-hover:duration-100 peer-hover:delay-300
                                                `}>
                                        <p className="bg-slate-700 text-white m-0 text-sm">Add column</p>
                                        <div className="text-slate-700 absolute top-[25px] text-2xl
                                        " >
                                            <GoTriangleDown/>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full"></div>
                            </div>

                                {itemsHtml[i]}

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
            columnNameRefs.current = []
            measureColumnNamesRefs.current = []
        }
    }, [renderGroups])   

    function createColorOptionsHtml(groupId) {
        let tempColorOptionsHtml = []
        for (let i=0; i<colorOptions.length; i++) {
            tempColorOptionsHtml.push(
                <div className="p-1 hover:bg-slate-100 rounded-md cursor-pointer" key={i} 
                    onMouseDown={() => {
                        setShowColorOptions(false)
                        editGroupColor(groupId, colorOptions[i])
                        setRenderComponent(!renderComponent)
                    }}>
                    <div className={`w-[22px] h-[22px] ${colorOptions[i]} rounded-[4px]`}></div>
                </div>
            )
        }
        setColorOptionsHtml(tempColorOptionsHtml)
    }

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
                group_id: groupId,
                board_id: boardId
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

    function editGroupColor(groupId, groupColor) {
        fetch('http://127.0.0.1:8000/board/edit-group-color/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                group_id: groupId,
                group_color: groupColor
            })
        })
        .then(res => res.json())
        .then(data => console.log(data))
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

    function addColumn(columnType) {
        fetch('http://127.0.0.1:8000/board/create-column/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                column_type: columnType,
                board_id: boardId
            })
        })
        .then(res => res.json())
        .then(data => {
            setShowAddColumn(false)
            setAddColumnsId('')
            setRenderComponent(!renderComponent)
        })
    }
    
    function deleteColumn(columnId) {
        fetch('http://127.0.0.1:8000/board/delete-column/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                column_id: columnId,
                board_id: boardId
            })
        })
        .then(res => res.json())
        .then(data => {
            setColumnOptionsSelectedId('')
            setRenderComponent(!renderComponent)
        })
    }

    function editColumnName(columnName, columnId) {
        fetch('http://127.0.0.1:8000/board/edit-column-name/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                column_id: columnId,
                column_name: columnName
            })
        })
        .then(res => res.json())
        .then(data => setRenderComponent(!renderComponent))
    }

    function editColumnValue(columnValueId, color, text) {
        fetch('http://127.0.0.1:8000/board/edit-column-value/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
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
            setRenderComponent(!renderComponent)
        })
    }


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