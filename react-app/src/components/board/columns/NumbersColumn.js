import { useState, useRef } from "react"
import { useBoardValues } from "../../../contexts/BoardValuesContext"

function NumbersColumn(props) {
    const boardValues = useBoardValues()
    const columnValueId = props.columnValues[props.k].id
    const columnValueNumber = parseFloat(props.columnValues[props.k].value_number)
    const [numberInputValue, setNumberInputValue] = useState('')
    const [inputClicked, setInputClicked] = useState(false)
    const inputRef = useRef('')

    function editNumbersColumn(numberValue) {
        fetch('http://127.0.0.1:8000/board/edit-numbers-column/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            },
            body: JSON.stringify({
                column_value_id: columnValueId,
                number_value: numberValue
            })
        })
        .then(res => res.json())
        .then(data => boardValues.setRenderComponent(prev => !prev))
    }

    return (
        <div className="min-w-36 border-t border-t-slate-300 border-r border-r-slate-300 flex justify-center items-center">
            <div className=" border border-transparent hover:border-slate-400 h-fit w-[90%] has-[:focus]:border-sky-600 relative group">
                <input type="number" className="w-full focus:outline-none px-2 no-spinner text-center peer" 
                value={inputClicked ? numberInputValue : columnValueNumber}
                ref={inputRef}
                onChange={(e) => {
                    setNumberInputValue(e.target.value)
                }}
                onFocus={() => {
                    if (!columnValueNumber) {
                        setNumberInputValue(0)
                    }
                    else {
                        setNumberInputValue(columnValueNumber)
                    }
                    setInputClicked(true)
                }}
                onBlur={(e) => editNumbersColumn(e.target.value)} 
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.target.blur()
                    }
                }}/>
                {(!columnValueNumber && columnValueNumber != 0 && numberInputValue === '') &&
                    <img src={process.env.PUBLIC_URL + `images/columns/hovers/numbersHover.png`} alt="" onClick={() => inputRef.current.focus()}
                         className=" h-[75%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible cursor-text peer-focus:invisible" />
                }
            </div>
        </div>
    )
}

export default NumbersColumn