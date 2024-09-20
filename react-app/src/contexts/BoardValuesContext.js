import { useState, useContext, createContext } from "react";

const BoardValuesContext = createContext()

export function BoardValuesProvider( {children} ) {

    const boardValues = {

    }

    return (
        <BoardValuesContext.Provider value={boardValues}>
            {children}
        </BoardValuesContext.Provider>
    )
}

export function useBoardValues() {
    return useContext(BoardValuesContext)
}