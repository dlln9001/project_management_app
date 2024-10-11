import { useRef, useEffect } from "react"
import { useBoardValues } from "../../../contexts/BoardValuesContext"
import { useBoardViews } from "../../../contexts/BoardViewsContext";
import { FiTrash } from "react-icons/fi";
import { GoTriangleLeft } from "react-icons/go";

function BoardViewsOptions(props) {
    const boardValues = useBoardValues()
    const boardViewsValues = useBoardViews()
    const boardViewsOptionsRef = useRef('')

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)
    }, [])

    function handleDocumentClick(e) {
        if (boardViewsOptionsRef.current && !boardViewsOptionsRef.current.contains(e.target)) {
            props.setBoardViewOptionsId('')
            boardViewsValues.setRenderBoardViews(prev => !prev)
        }
    }

    function deleteBoardView() {
        fetch('http://127.0.0.1:8000/board/delete-board-view/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            },
            body: JSON.stringify({
                board_view_option_id: props.boardViewOptionsId,
                board_id: props.boardId
            })
        })
            .then(res => res.json())
            .then(data => {
                boardValues.setRenderComponent(prev => !prev)
            })
    }

    return (
        <div className="absolute bg-white shadow-all-sides top-[25px] p-2 rounded-md" ref={boardViewsOptionsRef}>
            {props.boardView.name === 'Main Table'
            ? 
            <>
            <div className=" cursor-pointer  flex items-center px-2 py-1 gap-2 w-52 opacity-40 peer">
                <FiTrash className="" />
                Delete
            </div>
            <div className=" invisible peer-hover:visible bg-slate-700 text-white absolute p-1 px-2 left-60 top-2 w-44 text-center">
                <div className="absolute text-slate-700 right-[169px] text-xl">
                    <GoTriangleLeft />
                </div>
                Cannot delete this view
            </div>
            </>
            :
            <div className=" cursor-pointer hover:bg-slate-100 flex items-center px-2 py-1 gap-2 w-52" onClick={deleteBoardView}>
                <FiTrash className="" />
                Delete
            </div>
            }
        </div>
    )
}

export default BoardViewsOptions