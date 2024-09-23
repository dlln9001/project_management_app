import { useEffect, useState, useRef } from "react"
import GroupOptions from "./GroupOptions";
import Items from "../items/Items";
import AddColumn from "../columns/AddColumn"
import GroupNameInput from "./GroupNameInput";
import GroupAddItem from "./GroupAddItem";
import GroupSelectAllItems from "./GroupsSelectAllItems";
import { useBoardValues } from "../../../contexts/BoardValuesContext";
import ColumnOptions from "../columns/ColumnOptions";


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
    const boardValues = useBoardValues()

    let groupsData = boardValues.groupsData
    const [groupHtml, setGroupHtml] = useState('')

    const [columnOptionsSelectedId, setColumnOptionsSelectedId] = useState('')
    const columnNameRefs = useRef([])
    const measureColumnNamesRefs = useRef([])
    const [columnEditingName, setColumnEditingName] = useState('')
    const [columnNameEdited, setColumnNameEdited] = useState(false)
    const [columnNameEditedIndexes, setColumnNameEditedIndexes] = useState('')
    const [columnNameFocused, setColumnNameFocused] = useState(false)

     // renders all the groups in a separate use effect than the fetch
     useEffect(() => {
        if (Object.keys(groupsData).length != 0) {
            let tempGroupHtml = []

            // set the group html
            for (let i=0; i<groupsData.groupsInfo.length; i++) {
                let currentGroup = groupsData.groupsInfo[i]  
                let groupId = currentGroup.id
                let currentGroupsItems = groupsData.itemsInfo[i]

                // set the column type html. In the group for loop so it can know which group it is on to open column options on the right group
                let columnHtml = []
                for (let j=0; j<groupsData.columnsInfo.length; j++) {
                    // j is each column
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
                                        boardValues.setRenderGroups(!boardValues.renderGroups)
                                    }}
                                onFocus={() => {
                                    setColumnNameFocused(true)
                                    setColumnNameEditedIndexes([groupsData.columnsInfo[j].id, i])
                                    boardValues.setRenderGroups(!boardValues.renderGroups)
                                }}
                                onBlur={(e) => {
                                    setColumnNameFocused(false)
                                    setColumnNameEditedIndexes([])
                                    editColumnName(e.target.value, groupsData.columnsInfo[j].id)
                                    boardValues.setRenderGroups(!boardValues.renderGroups)
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
                                <ColumnOptions i={i} j={j} userToken={props.userToken} boardId={props.boardId}
                                               columnOptionsSelectedId={columnOptionsSelectedId} setColumnOptionsSelectedId={setColumnOptionsSelectedId}/>
                             }

                        </div>
                    )

                    resizeInput(i, columnNameRefs, measureColumnNamesRefs)
                }

                tempGroupHtml.push(
                    <div key={i} className="mt-10">
                        <div className="flex items-center mb-2 group">

                            <GroupOptions groupId={groupId} userToken={props.userToken} boardId={props.boardId}/>

                            <GroupNameInput groupId={groupId} userToken={props.userToken} currentGroup={currentGroup} i={i}
                                            currentGroupsItems={currentGroupsItems} boardId={props.boardId}/>

                        </div>

                        <div className="border border-slate-300 rounded-md border-r-0 border-l-0 rounded-r-none">
                            <div className="w-full flex bg-white">

                                <div className={`${currentGroup.color} min-w-[6px] justify-self-start rounded-tl-md`}></div>

                                <GroupSelectAllItems groupId={groupId}/>

                                <div className="min-w-[33%] px-2 border-r border-r-slate-300 flex items-center justify-center">
                                    <p className="text-sm text-slate-600 self-center  text-center">Item</p>
                                </div>

                                {columnHtml}

                                <AddColumn userToken={props.userToken} boardId={props.boardId} groupId={groupId}/>

                                <div className="w-full"></div>

                            </div>

                                <Items i={i} currentGroup={currentGroup} userToken={props.userToken}/>

                                <GroupAddItem i={i} currentGroup={currentGroup} userToken={props.userToken} groupId={groupId} boardId={props.boardId}/>
                        </div>
                    </div>
                )
            }
            
            setGroupHtml(tempGroupHtml)
            if (boardValues.reloadGroupsInitial) {
                boardValues.setRenderGroups(!boardValues.renderGroups)
                boardValues.setReloadGroupsInitial(false)
            }

            columnNameRefs.current = []
            measureColumnNamesRefs.current = []
        }
    }, [boardValues.renderGroups])   
    
        function resizeInput(index, inputRefs, measureInputRefs) {
            if (inputRefs.current[index] && measureInputRefs.current[index]) {
                measureInputRefs.current[index].textContent = inputRefs.current[index].value
                inputRefs.current[index].style.width = `${measureInputRefs.current[index].offsetWidth + 5}px`
            }
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
            .then(data => boardValues.setRenderComponent(!boardValues.renderComponent))
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