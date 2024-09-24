import { useState } from "react"
import { useBoardValues } from "../../../contexts/BoardValuesContext"

function ColumnNameInput(props) {
    const boardValues = useBoardValues()

    const [columnEditingName, setColumnEditingName] = useState('')
    const [columnNameEdited, setColumnNameEdited] = useState(false)
    const [columnNameEditedIndexes, setColumnNameEditedIndexes] = useState('')

    let i = props.i

    function editColumnName(columnName, columnId) {
        fetch('http://127.0.0.1:8000/board/edit-column-name/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            },
            body: JSON.stringify({
                column_id: columnId,
                column_name: columnName
            })
        })
        .then(res => res.json())
        .then(data => boardValues.setRenderComponent(!boardValues.renderComponent))
    }

    return (
        <>
        {boardValues.groupsData.columnsInfo[props.j] && 
        <>
        <div className={`${(props.columnNameFocused && columnNameEditedIndexes[0] === boardValues.groupsData.columnsInfo[props.j].id && columnNameEditedIndexes[1] === i)
            ? `border border-sky-600 w-10/12 mx-2`
            : `hover:border-slate-400 border border-white max-w-10/12`
            }   bg-white max-w-10/12 w-7/12`}>
            <input type="text" 
            className={` focus:outline-none max-w-full text-center focus:text-start text-ellipsis`}
            value={(columnNameEdited && columnNameEditedIndexes[0] === boardValues.groupsData.columnsInfo[props.j].id && columnNameEditedIndexes[1] === i)
            ? columnEditingName 
            : boardValues.groupsData.columnsInfo[props.j].name
            } 
            onChange={(e) => {
                    setColumnEditingName(e.target.value)
                    setColumnNameEdited(true)
                    boardValues.setRenderGroups(!boardValues.renderGroups)
                }}
            onFocus={() => {
                props.setColumnNameFocused(true)
                setColumnNameEditedIndexes([boardValues.groupsData.columnsInfo[props.j].id, i])
                boardValues.setRenderGroups(!boardValues.renderGroups)
            }}
            onBlur={(e) => {
                props.setColumnNameFocused(false)
                setColumnNameEditedIndexes([])
                editColumnName(e.target.value, boardValues.groupsData.columnsInfo[props.j].id)
                boardValues.setRenderGroups(!boardValues.renderGroups)
            }}
            onKeyDown={(e) => {
                if(e.key === 'Enter') {
                    e.target.blur()
                    editColumnName(e.target.value, boardValues.groupsData.columnsInfo[props.j].id)
                }
            }}
            />
        </div>
        <span className="text-lg p-1 px-2 invisible absolute min-w-3"></span>
    </>
    }
    </>
    )
}

export default ColumnNameInput