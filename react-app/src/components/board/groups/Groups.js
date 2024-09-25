import { useEffect, useState, useRef } from "react"
import GroupOptions from "./GroupOptions";
import Items from "../items/Items";
import AddColumn from "../columns/AddColumn"
import GroupNameInput from "./GroupNameInput";
import GroupAddItem from "./GroupAddItem";
import GroupSelectAllItems from "./GroupsSelectAllItems";
import { useBoardValues } from "../../../contexts/BoardValuesContext";
import ColumnOptions from "../columns/ColumnOptions";
import ColumnNameInput from "../columns/ColumnNameInput";


function Groups(props) {
    const boardValues = useBoardValues()

    let groupsData = boardValues.groupsData
    const [groupHtml, setGroupHtml] = useState('')

    const [columnOptionsSelectedId, setColumnOptionsSelectedId] = useState('')
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
                            <ColumnNameInput i={i} j={j} userToken={props.userToken} columnNameFocused={columnNameFocused} setColumnNameFocused={setColumnNameFocused}/>

                             
                             {!columnNameFocused && 
                                <ColumnOptions i={i} j={j} userToken={props.userToken} boardId={props.boardId}
                                               columnOptionsSelectedId={columnOptionsSelectedId} setColumnOptionsSelectedId={setColumnOptionsSelectedId}/>
                             }

                        </div>
                    )
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
        }
    }, [boardValues.renderGroups])   

    return (
        <>
            {groupHtml &&
                groupHtml
            }
        </>
    )
}


export default Groups