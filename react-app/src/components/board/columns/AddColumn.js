import React, { useState, useRef, useEffect } from "react";
import { IoIosAdd } from "react-icons/io";
import { GoTriangleDown } from "react-icons/go";
import { useBoardValues } from "../../../contexts/BoardValuesContext";

function AddColumn(props) {
    const boardValues = useBoardValues()

    const [showAddColumn, setShowAddColumn] = useState(false)
    const [addColumnsId, setAddColumnsId] = useState('')
    const addColumnsRef = useRef('')

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)
    }, [])

    function handleDocumentClick(e) {
        if (addColumnsRef.current && !addColumnsRef.current.contains(e.target)) {
            setShowAddColumn(false)
            setAddColumnsId('')
            boardValues.setRenderGroups(!boardValues.renderGroups)
        }
    }

    function addColumn(columnType) {
        fetch('http://127.0.0.1:8000/board/create-column/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            },
            body: JSON.stringify({
                column_type: columnType,
                board_id: props.boardId
            })
        })
        .then(res => res.json())
        .then(data => {
            setShowAddColumn(false)
            setAddColumnsId('')
            boardValues.setRenderComponent(!boardValues.renderComponent)
        })
    }

    return (
        <div className="text-2xl flex items-center justify-center mx-1 h-fit self-center group relative" ref={addColumnsRef} data-testid="add-column-button"
            onClick={() => {
                setShowAddColumn(true)
                setAddColumnsId(props.groupId)
                boardValues.setRenderGroups(!boardValues.renderGroups)
            }}>
            {(showAddColumn && addColumnsId === props.groupId) && 
                // this is the menu to add different columns
                <div className="absolute text-sm w-80 bg-white shadow-all-sides p-6 rounded-md right-[26px] top-0 z-10"
                    >
                    <p className="text-slate-500 mb-1 p-1">Essentials</p>
                    <div className="hover:bg-slate-100 rounded-md p-2 cursor-pointer flex items-center gap-2"
                        onClick={() => addColumn('Status')}>
                        <img src={process.env.PUBLIC_URL + 'images/statusColumn.png'} alt="" className="w-[7%] h-fit rounded-sm" />
                        <p>Status</p>
                    </div>
                </div>
            }
            <IoIosAdd className={`hover:bg-slate-100   rounded-sm cursor-pointer peer 
                    ${(showAddColumn && addColumnsId === props.groupId) ? `bg-slate-100 text-sky-600` : `text-slate-500 hover:text-slate-700`}`}/>
            <div 
                className={`absolute scale-0 justify-center bg-slate-700 py-[7px] px-4 rounded-md z-10 min-w-28 bottom-10 shadow-lg
                        peer-hover:flex peer-hover:scale-100 transition ease-in duration-0 peer-hover:duration-100 peer-hover:delay-300
                        `}>
                <p className="bg-slate-700 text-white m-0 text-sm">Add column</p>
                <div className="text-slate-700 absolute top-[25px] text-2xl
                " >
                    <GoTriangleDown/>
                </div>
            </div>
        </div>
    )
}

export default AddColumn