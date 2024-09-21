import { useState, useContext, createContext, useRef } from "react";

const BoardValuesContext = createContext()


export function BoardValuesProvider( {children} ) {

    const [boardTitle, setBoardTitle] = useState('')
    const [boardInfo, setBoardInfo] = useState('')

    // render groups does not send a request, render component does
    const [renderComponent, setRenderComponent] = useState(false)
    const [renderGroups, setRenderGroups] = useState(false)

    const [groupsData, setGroupsData] = useState({})
    // the width of the group names doesn't adjust until after the html has been set, so it needs to re render the groups
    const [reloadGroupsInitial, setReloadGroupsInitial] = useState(true)

    const [isItemSelected, setIsItemSelected] = useState(false)
    const [numberOfItemsSelected, setNumberOfItemsSelected] = useState('')
    const [itemSelected, setItemSelected] = useState([])
    // list of groups where all of their items have been selected
    const [groupsAllSelected, setGroupsAllSelected] = useState([])

    const [showBoardInfo, setShowBoardInfo] = useState(false)

    const boardValues = {
        boardTitle, setBoardTitle,
        boardInfo, setBoardInfo,
        renderComponent, setRenderComponent,
        renderGroups, setRenderGroups,
        groupsData, setGroupsData,
        reloadGroupsInitial, setReloadGroupsInitial,
        isItemSelected, setIsItemSelected,
        numberOfItemsSelected, setNumberOfItemsSelected,
        itemSelected, setItemSelected,
        groupsAllSelected, setGroupsAllSelected,
        showBoardInfo, setShowBoardInfo,
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