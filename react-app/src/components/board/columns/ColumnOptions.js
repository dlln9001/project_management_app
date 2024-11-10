import React, { useState, useEffect, useRef } from "react";
import { useBoardValues } from "../../../contexts/BoardValuesContext"
import { FiTrash } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";

function ColumnOptions(props) {
    const boardValues = useBoardValues()
    let i = props.i
    const columnOptionsSelectedRef = useRef('')


    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)
    }, [])

    function handleDocumentClick(e) {
        if (columnOptionsSelectedRef.current && !columnOptionsSelectedRef.current.contains(e.target)) {
            props.setColumnOptionsSelectedId('')
            boardValues.setRenderGroups(!boardValues.renderGroups)
        }
    }

    function deleteColumn(columnId) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/board/delete-column/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${ props.userToken }`
            },
            body: JSON.stringify({
                column_id: columnId,
                board_id: props.boardId
            })
        })
        .then(res => res.json())
        .then(data => {
            props.setColumnOptionsSelectedId('')
            boardValues.setRenderComponent(!boardValues.renderComponent)
        })
    }

    return (
        <>
        {boardValues.groupsData.columnsInfo[props.j] &&
            <div data-testid="open-column-options"
                className={`absolute right-0 mr-2  p-1 rounded-[4px] cursor-pointer  
                ${(props.columnOptionsSelectedId[0] === boardValues.groupsData.columnsInfo[props.j].id && props.columnOptionsSelectedId[1] === i)
            ? `text-slate-600 bg-sky-100`
            : `group-hover:text-inherit hover:bg-slate-200 text-white`} `}
                onClick={() => {
                props.setColumnOptionsSelectedId([boardValues.groupsData.columnsInfo[props.j].id, i])
                boardValues.setRenderGroups(!boardValues.renderGroups)
            }}>
                <BsThreeDots />
            {(props.columnOptionsSelectedId[0] === boardValues.groupsData.columnsInfo[props.j].id && props.columnOptionsSelectedId[1] === i) &&
                <div ref={columnOptionsSelectedRef} className="absolute bg-white shadow-all-sides rounded-md w-48 z-10 left-7 top-0 text-slate-700">
                    <div className="flex px-2 py-1 hover:bg-slate-100 m-2 rounded-md cursor-pointer" onClick={() => deleteColumn(boardValues.groupsData.columnsInfo[props.j].id)}>
                        <FiTrash className="mx-2 my-1"/>
                        <p>Delete</p>
                    </div>
                </div>
            }
            </div>
        }
        </>
    )
}

export default ColumnOptions