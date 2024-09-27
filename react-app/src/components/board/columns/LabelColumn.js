import { useState, useRef, useEffect } from "react";
import { useBoardValues } from "../../../contexts/BoardValuesContext"
import { GoTriangleUp } from "react-icons/go";

function LabelColumn(props) {
    const boardValues = useBoardValues()

    const [setColumnValueItemId, setSetColumnValueItemId] = useState('')
    const setColumnValueRef = useRef('')

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)
    }, [])

    function handleDocumentClick(e) {
        if (setColumnValueRef.current && !setColumnValueRef.current.contains(e.target)) {
            setSetColumnValueItemId('')
            boardValues.setRenderGroups(!boardValues.renderGroups)
        }
    }

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
            boardValues.setRenderComponent(!boardValues.renderComponent)
        })
    }

    return (
        <div ref={setColumnValueRef}
        className={`${props.columnValues[props.k].value_color} min-w-36  cursor-pointer flex relative justify-center items-center
        text-white 
        ${(setColumnValueItemId[0] === props.i && setColumnValueItemId[1] === props.j && setColumnValueItemId[2] === props.k) 
            ? `border border-sky-600` 
            : `border-t border-t-slate-300 border-r border-r-slate-300`}`}
        onClick={() => {
                setSetColumnValueItemId([props.i, props.j, props.k])
                boardValues.setRenderGroups(!boardValues.renderGroups)
        }}>
            <p>{props.columnValues[props.k].value_text}</p>
            {/* set labels menu */}
            {(setColumnValueItemId[0] === props.i && setColumnValueItemId[1] === props.j && setColumnValueItemId[2] === props.k) && 
                <div className="absolute bg-white z-10 top-9 flex flex-col items-center p-6 w-48 shadow-all-sides rounded-md text-center gap-2 cursor-default">
                    <GoTriangleUp className="absolute bottom-[189px] text-white text-3xl"/>
                    <div className="w-full bg-green-500 text-white p-[6px] rounded-sm cursor-pointer" 
                        onClick={() => editColumnValue(props.columnValues[props.k].id, 'bg-green-500', 'Done')}>Done</div>
                    <div className="w-full bg-orange-300 text-white p-[6px] rounded-sm cursor-pointer"
                        onClick={() => editColumnValue(props.columnValues[props.k].id, 'bg-orange-300', 'Working on it')}>Working on it</div>
                    <div className="w-full bg-red-500 text-white p-[6px] rounded-sm cursor-pointer"
                        onClick={() => editColumnValue(props.columnValues[props.k].id, 'bg-red-500', 'Stuck')}>Stuck</div>
                    <div className="w-full bg-neutral-400 text-white p-[6px] rounded-sm min-h-[32px] cursor-pointer"
                        onClick={() => editColumnValue(props.columnValues[props.k].id, 'bg-neutral-400', '')}></div>
                </div>
            }
        </div>
    )
}

export default LabelColumn