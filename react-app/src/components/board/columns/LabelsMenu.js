import { useState, useEffect } from "react";
import { GoTriangleUp } from "react-icons/go";
import { useBoardValues } from "../../../contexts/BoardValuesContext";

export function getStatusColumnValues(columnValueId) {
    // if you only need the text and color values, you can pass in a dummy Id, like -1.

    const statusColumnValues = [{id: columnValueId, text: 'Done', color: 'bg-green-500'}, {id: columnValueId, text: 'Working on it', color: 'bg-orange-300'}, 
        {id: columnValueId, text: 'Stuck', color: 'bg-red-500'},{id: columnValueId, text: '', color: 'bg-neutral-400'},
        ]

    return statusColumnValues
}

function LabelsMenu(props) {
    const boardValues = useBoardValues()
    const columnValueId = props.columnValues[props.k].id

    const [statusColumnValuesHtml, setStatusColumnValuesHtml] = useState('')
    const statusColumnValues = getStatusColumnValues(columnValueId)
    
    const [priorityColumnValuesHtml, setPriorityColumnValuesHtml] = useState('')
    const priorityColumnValues = [{id: columnValueId, text: 'Critical ⚠', color: 'bg-slate-800'}, {id: columnValueId, text: 'High', color: 'bg-violet-900'}, 
                                {id: columnValueId, text: 'Medium', color: 'bg-indigo-500'},{id: columnValueId, text: 'low', color: 'bg-blue-400'},
                                {id: columnValueId, text: '', color: 'bg-neutral-400'}
                                ]
    
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
            props.setShowMenu(false)
            boardValues.setRenderComponent(!boardValues.renderComponent)
        })
    }

    return (
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
    )
}

export default LabelsMenu