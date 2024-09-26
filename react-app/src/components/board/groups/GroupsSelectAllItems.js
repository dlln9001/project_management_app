import { useBoardValues } from "../../../contexts/BoardValuesContext";
import { FaCheck } from "react-icons/fa6";


function GroupSelectAllItems(props) {
    const boardValues = useBoardValues()
    let groupsData = boardValues.groupsData

    function selectAllItems() {
        let amountSelected = 0
        for (let i=0; i < groupsData.itemsInfo.length; i++) {
            // go through items, if they match the group that was clicked to select all items, they'll be added to selected items
            if (groupsData.itemsInfo[i].length != 0 && groupsData.itemsInfo[i][0].group === props.groupId) {
                let allItemsSelected = true
                let itemsInTheGroup = []
                for (let j=0; j<groupsData.itemsInfo[i].length; j++) {
                    itemsInTheGroup.push(groupsData.itemsInfo[i][j].id)
                    if (!boardValues.itemSelected.includes(groupsData.itemsInfo[i][j].id)) {
                        boardValues.setItemSelected(oldArr => [...oldArr, groupsData.itemsInfo[i][j].id])
                        amountSelected += 1
                        allItemsSelected = false
                    }
                }
                // if in the group, all the items were already selected, deselect all of the items
                if (allItemsSelected) {
                    let tempItemSelected = boardValues.itemSelected
                    // so we don't have issues with the for loop while removing elements
                    let newItemSelected = []

                    let groupIndex = boardValues.groupsAllSelected.indexOf(props.groupId)
                    let tempGroupsAllSelected = [...boardValues.groupsAllSelected]

                    tempGroupsAllSelected.splice(groupIndex, 1)
                    boardValues.setGroupsAllSelected(tempGroupsAllSelected)

                    for (let k=0; k<tempItemSelected.length; k++) {
                        if (!itemsInTheGroup.includes(tempItemSelected[k])) {
                            newItemSelected.push(tempItemSelected[k])
                        }
                        else {
                            amountSelected -= 1
                        }
                    }

                    boardValues.setItemSelected(newItemSelected)
                    console.log(newItemSelected, tempGroupsAllSelected)
                    if (newItemSelected.length === 0) {
                        boardValues.setIsItemSelected(false)
                    }
                }

                else {
                    boardValues.setGroupsAllSelected(oldArr => [...oldArr, props.groupId])
                    boardValues.setIsItemSelected(true)
                }
                boardValues.setRenderGroups(!boardValues.renderGroups)
                boardValues.setNumberOfItemsSelected(boardValues.itemSelected.length + amountSelected)
                return
            }
        }
    }

    return (
        <div className="p-2 flex items-center border-r border-r-slate-300">
            <div className={`w-4 h-4 border border-slate-300 hover:border-slate-600 cursor-pointer rounded-sm 
                ${boardValues.groupsAllSelected.includes(props.groupId) ? `bg-sky-600` : `bg-white`}`} 
                onClick={() => selectAllItems()}>
                    { boardValues.groupsAllSelected.includes(props.groupId) && 
                        <FaCheck color="white" className="h-4/5 w-4/5 mx-auto my-[1px]"/>
                    }
            </div>
        </div>
    )
}

export default GroupSelectAllItems