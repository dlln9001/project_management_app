import { useRef, useEffect } from "react"
import { useBoardValues } from "../../../contexts/BoardValuesContext"
import { FiTrash } from "react-icons/fi";

function BoardViewsOptions(props) {
    const boardValues = useBoardValues()
    const boardViewsOptionsRef = useRef('')

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)
    }, [])

    function handleDocumentClick(e) {
        if (boardViewsOptionsRef.current && !boardViewsOptionsRef.current.contains(e.target)) {
            props.setBoardViewOptionsId('')
            boardValues.setRenderBoardViews(prev => !prev)
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
                board_view_option_id: props.boardViewOptionsId
            })
        })
            .then(res => res.json())
            .then(data => boardValues.setRenderComponent(prev => !prev))
    }

    return (
        <div className="absolute bg-white shadow-all-sides top-[25px] p-2 rounded-md" ref={boardViewsOptionsRef}>
            <div className=" cursor-pointer hover:bg-slate-100 flex items-center px-2 py-1 gap-2 w-52" onClick={deleteBoardView}>
                <FiTrash className="" />
                Delete
            </div>
        </div>
    )
}

export default BoardViewsOptions