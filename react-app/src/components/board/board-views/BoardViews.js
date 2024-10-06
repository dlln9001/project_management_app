import { useState, useEffect } from "react"
import { useBoardViews } from "../../../contexts/BoardViewsContext";
import { BsThreeDots } from "react-icons/bs";
import BoardViewsOptions from "./BoardViewsOptions";
import AddBoardView from "./AddBoardView";

function BoardViews(props) {
    const boardViewsValues = useBoardViews()
    const [boardViewsHtml, setBoardViewsHtml] = useState('')
    const [showBoardViewOption, setBoardViewOption] = useState(false)
    const [boardViewOptionsId, setBoardViewOptionsId] = useState('')

    useEffect(() => {
        let tempBoardViewsHtml = []

        for (let i = 0; i < boardViewsValues.boardViewsInfo.length; i++) {
            const boardView = boardViewsValues.boardViewsInfo[i]

            tempBoardViewsHtml.push(
                <div key={i} className={`cursor-pointer py-[6px] rounded-t-[4px] text-sm flex group items-center relative 
                                        ${boardView.id === boardViewOptionsId ? `bg-slate-100` : `hover:bg-slate-100`}
                                        ${deepEqual(boardViewsValues.currentBoardView, boardView) ? `border-b-2 border-b-sky-600` : ``}`} 
                     onClick={() => {
                        boardViewsValues.setCurrentBoardView(boardView)
                        boardViewsValues.setRenderBoardViews(prev => !prev)
                    }}>
                    <p className={`mr-5 ml-5 ${boardView.id === boardViewOptionsId ? `-translate-x-4` : `transition-all duration-100 group-hover:-translate-x-4`}`}>
                        {boardView.name}
                    </p>
                    <div className="absolute right-3"
                        onClick={(e) => {
                            e.stopPropagation()
                            setBoardViewOption(true)
                            setBoardViewOptionsId(boardView.id)
                            boardViewsValues.setRenderBoardViews(prev => !prev)
                        }}>
                        <div className={`p-[2px] rounded-sm ${boardView.id === boardViewOptionsId ? `bg-sky-200 visible` : `invisible group-hover:visible hover:bg-sky-200`}`}>
                            <BsThreeDots />
                        </div>
                        {(showBoardViewOption && boardView.id === boardViewOptionsId) &&
                            <BoardViewsOptions boardViewOptionsId={boardViewOptionsId} setBoardViewOptionsId={setBoardViewOptionsId} userToken={props.userToken} boardId={props.boardId}/>
                        }
                    </div>
                </div>
            )
        }
        setBoardViewsHtml(tempBoardViewsHtml)
    }, [boardViewsValues.boardViewsInfo, boardViewsValues.renderBoardViews])

    function deepEqual(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2)
    }

    return (
        <div className="border-b border-slate-300 mt-3 flex">
            {boardViewsHtml}
            <AddBoardView userToken={props.userToken} boardId={props.boardId}/>
        </div>
    )
}

export default BoardViews