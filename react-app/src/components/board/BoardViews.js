import { useState, useEffect } from "react"
import { useBoardValues } from "../../contexts/BoardValuesContext"
import { BsThreeDots } from "react-icons/bs";
import BoardViewsOptions from "./BoardViewsOptions";

function BoardViews(props) {
    const boardValues = useBoardValues()
    const [boardViewsHtml, setBoardViewsHtml] = useState('')
    const [showBoardViewOption, setBoardViewOption] = useState(false)
    const [boardViewOptionsId, setBoardViewOptionsId] = useState('')
    
    useEffect(() => {
        let tempBoardViewsHtml = []

        for (let i=0; i < boardValues.boardViewsInfo.length; i++) {
            const boardView = boardValues.boardViewsInfo[i]
            tempBoardViewsHtml.push(
                <div key={i} className={`cursor-pointer py-[6px] rounded-md text-sm w-28 min-w-28 max-w-28 flex group items-center relative 
                                        ${boardView.id === boardViewOptionsId ? `` : `hover:bg-slate-100`}`} >
                    <p className={`${boardView.id === boardViewOptionsId ? `ml-1 block` : `transition-all ml-4 duration-100 group-hover:ml-1 block`}`}>
                        {boardView.name} 
                    </p>
                    <div className="absolute right-3" 
                         onClick={() => {
                            setBoardViewOption(true)
                            setBoardViewOptionsId(boardView.id)
                            boardValues.setRenderBoardViews(prev => !prev)
                        }}>
                        <div className={`p-[2px] rounded-sm ${boardView.id === boardViewOptionsId ? `bg-sky-200 visible` : `invisible group-hover:visible hover:bg-sky-200`}`}>
                            <BsThreeDots />
                        </div>
                        {(showBoardViewOption && boardView.id === boardViewOptionsId) &&
                            <BoardViewsOptions boardViewOptionsId={boardViewOptionsId} setBoardViewOptionsId={setBoardViewOptionsId} userToken={props.userToken}/>
                        }
                    </div>
                </div>
            )
        }
        setBoardViewsHtml(tempBoardViewsHtml)
    }, [boardValues.boardViewsInfo, boardValues.renderBoardViews])

    return (
        <div className="border-b border-slate-300 mt-10 flex">
            {boardViewsHtml}
        </div>
    )
}

export default BoardViews