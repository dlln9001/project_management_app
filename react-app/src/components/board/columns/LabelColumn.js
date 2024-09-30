import { useState, useRef, useEffect } from "react";
import { useBoardValues } from "../../../contexts/BoardValuesContext"
import { GoTriangleUp } from "react-icons/go";

function LabelColumn(props) {
    const boardValues = useBoardValues()
    const columnValueId = props.columnValues[props.k].id

    const [setColumnValueItemId, setSetColumnValueItemId] = useState('')
    const setColumnValueRef = useRef('')

    const [statusColumnValuesHtml, setStatusColumnValuesHtml] = useState('')
    const statusColumnValues = [{id: columnValueId, text: 'Done', color: 'bg-green-500'}, {id: columnValueId, text: 'Working on it', color: 'bg-orange-300'}, 
                                {id: columnValueId, text: 'Stuck', color: 'bg-red-500'},{id: columnValueId, text: '', color: 'bg-neutral-400'},
                                ]
    
    const [priorityColumnValuesHtml, setPriorityColumnValuesHtml] = useState('')
    const priorityColumnValues = [{id: columnValueId, text: 'Critical ⚠', color: 'bg-slate-800'}, {id: columnValueId, text: 'High', color: 'bg-violet-900'}, 
                                {id: columnValueId, text: 'Medium', color: 'bg-indigo-500'},{id: columnValueId, text: 'low', color: 'bg-blue-400'},
                                {id: columnValueId, text: '', color: 'bg-neutral-400'}
                                ]

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)
    }, [])

    useEffect(() => {

        // set the status options
        let tempStatusColumnValuesHtml = []
        for (let i=0; i < statusColumnValues.length; i++) {
            tempStatusColumnValuesHtml.push(
                <div key={i} className={`w-full ${statusColumnValues[i].color} text-white p-[6px] rounded-sm cursor-pointer min-h-8 hover:opacity-90`} 
                onClick={() => editLabelColumn(statusColumnValues[i].id, statusColumnValues[i].color, statusColumnValues[i].text)}>{statusColumnValues[i].text}</div>
            )
        }
        setStatusColumnValuesHtml(tempStatusColumnValuesHtml)

        // set the priority options
        let tempPriorityColumnValuesHtml = []
        for (let i=0; i < priorityColumnValues.length; i++) {
            tempPriorityColumnValuesHtml.push(
                <div key={i} className={`w-full ${priorityColumnValues[i].color} text-white p-[6px] rounded-sm cursor-pointer min-h-8 hover:opacity-90`} 
                onClick={() => editLabelColumn(priorityColumnValues[i].id, priorityColumnValues[i].color, priorityColumnValues[i].text)}>{priorityColumnValues[i].text}</div>
            )
        }
        setPriorityColumnValuesHtml(tempPriorityColumnValuesHtml)

    }, [boardValues.renderComponent, boardValues.renderGroups])

    function handleDocumentClick(e) {
        if (setColumnValueRef.current && !setColumnValueRef.current.contains(e.target)) {
            setSetColumnValueItemId('')
            boardValues.setRenderGroups(!boardValues.renderGroups)
        }
    }

    function editLabelColumn(columnValueId, color, text) {
        fetch('http://127.0.0.1:8000/board/edit-label-column/', {
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
                    {props.associatedColumn.column_type === 'Status' && 
                        <>
                        <GoTriangleUp className="absolute bottom-[189px] text-white text-3xl"/>
                        {statusColumnValuesHtml}
                        </>
                    }
                    {props.associatedColumn.column_type === 'Priority' && 
                        <>
                        <GoTriangleUp className="absolute bottom-[229px] text-white text-3xl"/>
                        {priorityColumnValuesHtml}
                        </>
                    }
                </div>
            }
        </div>
    )
}

export default LabelColumn