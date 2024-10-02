import { useState, useRef, useEffect } from "react"
import { useBoardValues } from "../../../contexts/BoardValuesContext"

function TextColumn(props) {
    const boardValues = useBoardValues()
    const columnValueId = props.columnValues[props.k].id
    const columnValueText = props.columnValues[props.k].value_text
    const [textInputValue, setTextInputValue] = useState('')
    const [inputClicked, setInputClicked] = useState(false)
    const inputRef = useRef('')

    function editTextColumn(textValue) {
        fetch('http://127.0.0.1:8000/board/edit-text-column/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            },
            body: JSON.stringify({
                column_value_id: columnValueId,
                text_value: textValue
            })
        })
        .then(res => res.json())
        .then(data => {
            boardValues.setRenderComponent(prev => !prev)
        })
    }
    
    return (
        <div className="min-w-36 border-t border-t-slate-300 border-r border-r-slate-300 flex justify-center items-center">
        <div className=" border border-transparent hover:border-slate-400 h-fit w-[90%] has-[:focus]:border-sky-600 relative group">
            <input type="text" className="w-full focus:outline-none px-2 no-spinner text-center peer" 
            value={inputClicked ? textInputValue : columnValueText}
            ref={inputRef}
            onChange={(e) => {
                setTextInputValue(e.target.value)
                boardValues.setRenderGroups(prev => !prev)
            }}
            onFocus={() => {
                setTextInputValue(columnValueText)
                setInputClicked(true)
            }}
            onBlur={(e) => editTextColumn(e.target.value)} 
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    // will trigger on blur function which will edit text column
                    e.target.blur()
                }
            }}/>
            {(!columnValueText && textInputValue === '') &&
                <img src={process.env.PUBLIC_URL + `images/columns/hovers/textHover.png`} alt="" onClick={() => inputRef.current.focus()}
                     className=" h-[60%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible cursor-text peer-focus:invisible" />
            }
        </div>
    </div>
    )
}

export default TextColumn