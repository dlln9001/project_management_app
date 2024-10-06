import React, { useState, useContext, createContext} from "react";

export const BoardViewsContext = createContext()

export function BoardViewsProvider({ children }) {

    const [boardViewsInfo, setBoardViewsInfo] = useState('')
    const [renderBoardViews, setRenderBoardViews] = useState(false)
    const [currentBoardView, setCurrentBoardView] = useState('')

    const boardViewsValues = {
        boardViewsInfo, setBoardViewsInfo,
        renderBoardViews, setRenderBoardViews,
        currentBoardView, setCurrentBoardView
    }

    return (
        <BoardViewsContext.Provider value={boardViewsValues}>
            { children }
        </BoardViewsContext.Provider>
    )
}

export function useBoardViews() {
    return useContext(BoardViewsContext)
}