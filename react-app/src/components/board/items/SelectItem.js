import { useBoardValues } from "../../../contexts/BoardValuesContext"
import { FaCheck } from "react-icons/fa6";

function SelectItem(props) {
    const boardValues = useBoardValues()

    function handleItemSelect(groupIndex, itemIndex) {
        let tempItemSelected = [...boardValues.itemSelected]
        let itemId = boardValues.groupsData.itemsInfo[groupIndex][itemIndex].id
        if (tempItemSelected.includes(itemId)) {
            for (let i=0; i<tempItemSelected.length; i++) {
                if (tempItemSelected[i] === itemId) {
                    tempItemSelected.splice(i, 1)
                }
            }
            if (tempItemSelected.length === 0) {
                boardValues.setIsItemSelected(false)
            }
            // removes the group so it doesn't show the entire group is selected anymore, if it was.
            let groupId = boardValues.groupsData.itemsInfo[groupIndex][itemIndex].group
            if (boardValues.groupsAllSelected.includes(groupId)) {
                let index = boardValues.groupsAllSelected.indexOf(groupId)
                boardValues.groupsAllSelected.splice(index, 1)
            }
            boardValues.setNumberOfItemsSelected(tempItemSelected.length)
            boardValues.setItemSelected(tempItemSelected)
        }
        else {
            boardValues.setNumberOfItemsSelected(boardValues.itemSelected.length + 1)
            boardValues.setItemSelected(oldArr => [...oldArr, itemId])
            boardValues.setIsItemSelected(true)
        }
        boardValues.setRenderGroups(!boardValues.renderGroups)

    }
    
    return (
    <>
        {(boardValues.groupsData.itemsInfo[props.i]?.[props.j]) &&
        <>
        <div className={`${props.currentGroup.color} w-[6px] justify-self-start min-w-[6px]`}></div>
        <div className="p-2 flex items-center border-r border-r-slate-300 border-t border-t-slate-300">
            <div className={`w-4 h-4 border  cursor-pointer rounded-sm
                ${boardValues.itemSelected.includes(boardValues.groupsData.itemsInfo[props.i][props.j].id) ? `bg-sky-600 hover:bg-sky-700` : `bg-white border-slate-300 hover:border-slate-600`}`}
                onClick={() => handleItemSelect(props.i, props.j)}
            >
                {boardValues.itemSelected.includes(boardValues.groupsData.itemsInfo[props.i][props.j].id) && 
                    <FaCheck color="white" className="h-4/5 w-4/5 mx-auto my-[1px]"/>
                }
            </div>
        </div>
        </>
        }
    </>
    )
}

export default SelectItem