import { useState, useEffect, useRef } from "react"
import { FaCheck } from "react-icons/fa6";
import { GoTriangleUp } from "react-icons/go";

function Items(props) {
    let groupsData = props.groupsData
    // i here is the group index, groups data has the groups and items ordered the same, so if you have the right group index, you can get its items
    let i = props.i

    const [focusedItem, setFocusedItem] = useState([])
    const [editingItemContents, setEditingItemContents] = useState('')

    const [setColumnValueItemId, setSetColumnValueItemId] = useState('')
    const setColumnValueRef = useRef('')

    const [itemsHtml, setitemsHtml] = useState('')

    const [renderItems, setRenderItems] = useState('')

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)
    }, [])

    function handleDocumentClick(e) {
        if (setColumnValueRef.current && !setColumnValueRef.current.contains(e.target)) {
            setSetColumnValueItemId('')
            props.setRenderGroups(!props.renderGroups)
        }
    }

    useEffect(() => {
        let itemHtml = []
        let tempItemsHtml = []

        console.log('items Rendereeed: ')

        // this variable is so that when a user clicks on a new board, when items are selected, that the item menu doesn't show up on separate boards
        let itemIdCheck = false
        if (!itemIdCheck) {
            props.setIsItemSelected(false)
            props.setItemSelected([])
        }

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
                        <div className={`${props.currentGroup.color} w-[6px] justify-self-start min-w-[6px]`}></div>
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
            tempItemsHtml.push(itemHtml)
            itemHtml = []
        } 
        setitemsHtml(tempItemsHtml)

    }, [props.renderGroups, renderItems])

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

    function handleItemSelect(groupIndex, itemIndex) {
        let tempItemSelected = [...props.itemSelected]
        let itemId = groupsData.itemsInfo[groupIndex][itemIndex].id
        console.log('itemId: ', itemId, tempItemSelected, tempItemSelected.includes(itemId))
        if (tempItemSelected.includes(itemId)) {
            for (let i=0; i<tempItemSelected.length; i++) {
                if (tempItemSelected[i] === itemId) {
                    tempItemSelected.splice(i, 1)
                    console.log('item spliced')
                }
            }
            if (tempItemSelected.length === 0) {
                props.setIsItemSelected(false)
                console.log('ja;lskdjflk;asj dflk  runing faseSSSS')
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
            console.log('adding iididttem ')
            props.setNumberOfItemsSelected(props.itemSelected.length + 1)
            props.setItemSelected(oldArr => [...oldArr, itemId])
            props.setIsItemSelected(true)
        }
        setRenderItems(!renderItems)

    }
    console.log('is item selected (ITEMS): ', props.isItemSelected)

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

    return (
        <div>
            {itemsHtml}
        </div>
    )
}

export default Items