import { useEffect, useState, useRef } from "react"
import { useBoardValues } from "../../../contexts/BoardValuesContext"
import { editItem } from "../items/Items"

function KanbanItemInput(props) {
    const boardValues = useBoardValues()
    const [inputValue, setInputValue] = useState('')
    const [inputClicked, setInputClicked] = useState(false)

    return (
        <div className="border border-transparent hover:border-slate-300 px-[3px] rounded-[4px] cursor-pointer has-[:focus]:border-sky-600">
            <input type="text" value={inputClicked ? inputValue : props.itemInfo.name} className=' focus:outline-none cursor-pointer w-full truncate text-ellipsis'
                    onFocus={(e) => {
                        setInputValue(e.target.value)
                        setInputClicked(true)
                    }}
                    onChange={(e) => {
                        setInputValue(e.target.value)
                    }}
                    onBlur={(e) => {
                        editItem(e.target.value, props.itemInfo.id, props.userToken, boardValues.setRenderComponent)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.target.blur()
                        }
                    }}
                    />
        </div>
    )
}

export default KanbanItemInput