import { useState, useEffect, useRef } from "react"
import { useBoardValues } from "../../../contexts/BoardValuesContext";
import SelectItem from "./SelectItem";
import ItemColumnValue from "../columns/ItemColumnValue";
import ItemUpdates from "./ItemUpdates";
import { BiCommentAdd } from "react-icons/bi";


export function editItem(itemContent, itemId, userToken, setRenderComponent) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/board/edit-item/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${ userToken }`
        },
        body: JSON.stringify({
            item_id: itemId,
            item_name: itemContent,
        })
    })
    .then(res => res.json())
    .then(data => setRenderComponent(prev => !prev))
}

function Items(props) {
    const boardValues = useBoardValues()

    let groupsData = boardValues.groupsData
    // i here is the group index, groups data has the groups and items ordered the same, so if you have the right group index, you can get its items
    let i = props.i

    const [focusedItem, setFocusedItem] = useState([])
    const [editingItemContents, setEditingItemContents] = useState('')

    const [itemsHtml, setitemsHtml] = useState('')

    const [showItemUpdates, setShowItemUpdates] = useState(false)
    const [itemUpdateName, setItemUpdateName] = useState('')
    const [itemUpdateId, setItemUpdateId] = useState('')
    const itemUpdateButtonRef = useRef('')

    useEffect(() => {
        if (Object.keys(groupsData.itemsInfo).length != 0 && groupsData.itemsInfo[i]) {
            let itemHtml = []
            let tempItemsHtml = []
            for (let j=0; j<groupsData.itemsInfo[i].length; j++) {
                let columnValues = groupsData.columnValues[i][j]
                let columnValuesHtml = []
                // currently not tied to the columns, only items
                // set columnValues html for each item
                for (let k=0; k<columnValues.length; k++) {
                    columnValuesHtml.push(
                        <ItemColumnValue i={i} j={j} k={k} columnValues={columnValues} key={k} userToken={props.userToken}/>
                    )
                }

                itemHtml.push(
                    <div key={j} className=" w-full text-sm text-slate-600 hover:bg-slate-100 flex max-h-[33px]">
                        {/* the box that allows for selecting icons */}
                        <SelectItem i={i} j={j} currentGroup={props.currentGroup}/>

                        <div className=" border-t flex border-t-slate-300 min-w-[500px] border-r border-r-slate-300 items-center">
                            {/* this is where the user inputs the item content */}
                            <input type="text" 
                                onFocus={() => {
                                    setFocusedItem([i, j])
                                    setEditingItemContents(groupsData.itemsInfo[i][j].name)
                                    boardValues.setRenderGroups(!boardValues.renderGroups)
                                }}
                                onBlur={(e) => editItem(e.target.value, groupsData.itemsInfo[i][j].id, props.userToken, boardValues.setRenderComponent)}
                                onChange={(e) => {
                                    setEditingItemContents(e.target.value)
                                    boardValues.setRenderGroups(!boardValues.renderGroups)
                                }}
                                value={(focusedItem[0] === i && focusedItem[1] === j) ? editingItemContents : groupsData.itemsInfo[i][j].name}
                                tabIndex={0}
                                className={`border border-transparent focus:outline-none hover:border hover:border-slate-300 rounded-sm px-1 focus:bg-white 
                                        truncate text-ellipsis min-w-8 w-full focus:border-sky-600 h-fit self-center mx-2`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.target.blur()
                                    }
                                }}
                            />
                            
                            <div 
                                className="border-l border-l-slate-300 flex justify-center h-full items-center px-4 text-lg cursor-pointer hover:text-sky-600"
                                onClick={() => {
                                    setItemUpdateName(groupsData.itemsInfo[i][j].name)
                                    setItemUpdateId(groupsData.itemsInfo[i][j].id)
                                    setShowItemUpdates(true)
                                    boardValues.setRenderGroups(prev => !prev)
                                }}>
                                <BiCommentAdd />
                            </div>

                        </div>
                        {columnValuesHtml}
                        <div className=" w-full border-t border-t-slate-300"></div>
                    </div> 
                )
                tempItemsHtml.push(itemHtml)
                itemHtml = []
            } 
            setitemsHtml(tempItemsHtml)
    }
    }, [boardValues.renderGroups])


    return (
        <>
            <div>
                {itemsHtml}
            </div>
            
            {showItemUpdates &&
                <ItemUpdates 
                    itemUpdateName={itemUpdateName}
                    setItemUpdateName={setItemUpdateName}
                    itemUpdateId={itemUpdateId}
                    setShowItemUpdates={setShowItemUpdates}
                    itemUpdateButtonRef={itemUpdateButtonRef}
                    userToken={props.userToken}/>
            }
        </>
    )
}

export default Items