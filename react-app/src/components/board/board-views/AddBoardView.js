import { useState, useRef, useEffect } from "react";
import { useBoardValues } from "../../../contexts/BoardValuesContext";
import { IoIosAdd } from "react-icons/io";
import { CiViewTable } from "react-icons/ci";
import { LuKanban } from "react-icons/lu";

function AddBoardView(props) {
    const boardValues = useBoardValues()
    const [showAddBoardViewOptions, setShowAddBoardViewOptions] = useState(false)
    const addBoardViewOptionsRef = useRef('')

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)
    }, [])

    function handleDocumentClick(e) {
        if (addBoardViewOptionsRef.current && !addBoardViewOptionsRef.current.contains(e.target)) {
            setShowAddBoardViewOptions(false)
        }
    }

    function addBoardView(name, type) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/board/add-board-view/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            },
            body: JSON.stringify({
                board_id: props.boardId,
                name: name,
                type: type
            })
        })
        .then(res => res.json())
        .then(data => {
            setShowAddBoardViewOptions(false)
            boardValues.setRenderComponent(prev => !prev)
        })
    }

    return (
        <div className=" flex items-center justify-center self-center relative mx-3" ref={addBoardViewOptionsRef}>
            <div className="h-7 w-7 hover:bg-slate-100 rounded-sm text-2xl flex items-center justify-center cursor-pointer" 
                 onClick={() => setShowAddBoardViewOptions(true)}>
                <IoIosAdd className="text-slate-700"/> 
            </div>
            {showAddBoardViewOptions && 
                <div className="absolute bg-white shadow-all-sides p-2 rounded-md w-60 left-0 top-7 text-sm">
                    <p className=" opacity-65 mx-2 mb-3">Board views</p>
                    {/* <div className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-slate-100">
                        <CiViewTable className="text-base" />
                        <p>Table</p>
                    </div> */}
                    <div className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-slate-100" onClick={() => addBoardView('Kanban', 'Kanban')}>
                        <LuKanban className="text-base"/>
                        <p>Kanban</p>
                    </div>
                </div> 
            }
        </div>
    )
}

export default AddBoardView