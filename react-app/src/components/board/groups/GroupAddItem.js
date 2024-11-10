import { useState } from "react"
import { useBoardValues } from "../../../contexts/BoardValuesContext"

export function createItem(groupId, addItemContent, setAddItemContent = '', boardId, userToken, renderComponent, setRenderComponent, renderGroups, setRenderGroups) {
    if (addItemContent) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/board/create-item/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${ userToken }`
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
            setRenderComponent(prev => !prev)
        })
    }
    if (setAddItemContent) {
        setAddItemContent('')
    }
    setRenderGroups(!renderGroups)

}

function GroupAddItem(props) {
    const boardValues = useBoardValues()
    let i = props.i

    const [addItemContent, setAddItemContent] = useState('')
    const [focusedAddItem, setFocusedAddItem] = useState('')

    function enterAddItem(e, groupId, addItemContent) {
        if (e.key === 'Enter') {
            createItem(groupId, addItemContent, setAddItemContent, props.boardId, props.userToken, boardValues.renderComponent, boardValues.setRenderComponent, boardValues.renderGroups, boardValues.setRenderGroups)
        }
    }

    function changeFocusedAddItem(value) {
        setAddItemContent(value)
        boardValues.setRenderGroups(!boardValues.renderGroups)
    }

    function addItemFocus(i) {
        setFocusedAddItem(i)
        boardValues.setRenderGroups(!boardValues.renderGroups)
    }

    return (
        <div className={`flex`}>
            <div className={`${ props.currentGroup.color } w-[6px] justify-self-start rounded-bl-md opacity-50`}></div>
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
                onBlur={() => createItem(props.groupId, addItemContent, setAddItemContent, props.boardId, props.userToken, boardValues.renderComponent, boardValues.setRenderComponent, boardValues.renderGroups, boardValues.setRenderGroups)}
                onKeyDown={(e) => enterAddItem(e, props.groupId, addItemContent)}
                /> 
            </div>
        </div>
    )
}

export default GroupAddItem