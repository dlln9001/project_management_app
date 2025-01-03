import { useEffect, useState, useRef } from "react"
import { useBoardValues } from "../../../contexts/BoardValuesContext"
import { getStatusColumnValues } from "../columns/LabelsMenu"
import LabelsMenu from "../columns/LabelsMenu"
import KanbanItemInput from "./KanbanItemInput"


function Kanban(props) {
    const boardValues = useBoardValues()
    const [kanbanListsHtml, setKanBanListsHtml] = useState('')
    const statusColumnValues = getStatusColumnValues(-1)
    const groupsData = boardValues.groupsData
    const [showLabelsMenu, setShowLabelsMenu] = useState(false)
    const [renderKanban, setRenderKanban] = useState(false)

    // position of the item with the indexes of the for loop
    const [itemPositionId, setItemPositionId] = useState([])

    const clickedLablesMenuParentRef = useRef('')

    useEffect(() => {
        let statusColumnOrder = 'no order'
        let statusColumn 
        let priorityColumnOrder = 'no order'
        let priorityColumn

        for (let i=0; i < groupsData.columnsInfo.length; i++) {
            if (groupsData.columnsInfo[i].column_type === 'Status') {
                statusColumnOrder = groupsData.columnsInfo[i].order
                statusColumn = groupsData.columnsInfo[i]
            }
            else if (groupsData.columnsInfo[i].column_type === 'Priority') {
                priorityColumnOrder = groupsData.columnsInfo[i].order
                priorityColumn = groupsData.columnsInfo[i]
            }
        }


        let tempKanbanListsHtml = []
        if (statusColumnOrder != 'no order') {
            for (let i=0; i<statusColumnValues.length; i++) {
                let itemsHtml = []
                const columnValueColor = statusColumnValues[i].color.replace('bg-', '')

                // so we don't need a nested for loop
                let flat_columnValues = groupsData.columnValues.flat()
                let flat_itemsInfo = groupsData.itemsInfo.flat()
                let num_of_items = 0
                // set the item html
                for (let j=0; j<flat_columnValues.length; j++) {
                    // if the type of the status is equal to the type being made on the kanban board. E.g status with "done" will be put under the "done" list in the kanban board
                    if (flat_columnValues[j][statusColumnOrder].value_text === statusColumnValues[i].text) {
                        let priorityValueColor
                        if (priorityColumn) {
                            priorityValueColor = flat_columnValues[j][priorityColumnOrder].value_color.replace('bg-', '')
                        }
                        let no_status = false
                        if (statusColumnValues[i].text === '') {
                            no_status = true
                        }
                        num_of_items += 1
                        // columnvalues and itemsinfo both have same indexes that refer to the same item
                        itemsHtml.push(
                            <div key={j} className="bg-white border border-slate-300 rounded-md p-2 min-h-20 text-sm">
                                <KanbanItemInput itemInfo={flat_itemsInfo[j]} userToken={props.userToken}/>

                                    <div className="flex gap-2"> 
                                        
                                            <div className={`text-sm mt-2 bg-slate-100 w-fit px-2 py-[1px] border-${columnValueColor} border-l-4 rounded-sm cursor-pointer flex justify-center`}
                                                    onClick={() => {
                                                        if (!(itemPositionId[0] === i && itemPositionId[1] === j && itemPositionId[2] === 'Status')) {
                                                            clickedLablesMenuParentRef.current = ''
                                                            setItemPositionId([i, j, 'Status'])
                                                        }

                                                        setShowLabelsMenu(true)
                                                        setRenderKanban(prev => !prev)
                                                    }}
                                                    ref={(itemPositionId[0] === i && itemPositionId[1] === j && itemPositionId[2] === 'Status') ? clickedLablesMenuParentRef : null}>
                                                    <p> 
                                                        {no_status 
                                                        ? 'No status'
                                                        : statusColumnValues[i].text
                                                        }
                                                    </p>
                                                    {(itemPositionId[0] === i && itemPositionId[1] === j && itemPositionId[2] === 'Status' && showLabelsMenu && clickedLablesMenuParentRef) &&
                                                        <div>
                                                            <LabelsMenu k={statusColumnOrder} associatedColumn={statusColumn} columnValues={flat_columnValues[j]} userToken={props.userToken} 
                                                                        showMenu={showLabelsMenu} setShowMenu={setShowLabelsMenu} parentRef={clickedLablesMenuParentRef}/>
                                                        </div>
                                                    }
                                            </div>
                                        
                                        {(priorityColumn && flat_columnValues[j][priorityColumnOrder].value_text != '') &&
                                            <div className={`text-sm mt-2 bg-slate-100 w-fit px-2 py-[1px] border-${priorityValueColor} border-l-4 rounded-sm cursor-pointer`}
                                                onClick={() => {
                                                    if (!(itemPositionId[0] === i && itemPositionId[1] === j && itemPositionId[2] === 'Priority')) {
                                                        clickedLablesMenuParentRef.current = ''
                                                        setItemPositionId([i, j, 'Priority'])
                                                    }
                                                    setShowLabelsMenu(true)
                                                    setRenderKanban(prev => !prev)
                                                }}
                                                ref={(itemPositionId[0] === i && itemPositionId[1] === j && itemPositionId[2] === 'Priority') ? clickedLablesMenuParentRef : null}>
                                                <p>
                                                    {flat_columnValues[j][priorityColumnOrder].value_text}
                                                </p>
                                                {(itemPositionId[0] === i && itemPositionId[1] === j && itemPositionId[2] === 'Priority' && showLabelsMenu && clickedLablesMenuParentRef) &&
                                                    <div>
                                                        <LabelsMenu k={priorityColumnOrder} associatedColumn={priorityColumn} columnValues={flat_columnValues[j]} userToken={props.userToken} 
                                                                    showMenu={showLabelsMenu} setShowMenu={setShowLabelsMenu} parentRef={clickedLablesMenuParentRef}/>
                                                    </div>
                                                }
                                            </div>
                                        }
                                    </div>
                            </div> 
                        )
                    }
                }

                let default_blank_text = 'Blank'

                tempKanbanListsHtml.push(
                    <div className=" w-64" key={i}>
                        <div className={`${statusColumnValues[i].color} rounded-t-md text-white px-3 py-2`}>
                            {statusColumnValues[i].text 
                            ? statusColumnValues[i].text + ' / ' + num_of_items
                            : default_blank_text + ' / ' + num_of_items
                            }
                        </div>
                        <div className=" bg-slate-50 h-[600px] p-3 flex flex-col gap-2 rounded-b-md custom-scrollbar-small overflow-auto">
                            {itemsHtml}
                        </div>
                    </div>
                )
            }
            }
            else {
                tempKanbanListsHtml.push(
                    <p className=" font-bold text-lg my-5" key={1}>
                        Add a status column to see your Kanban
                    </p>
                )
            }

        setKanBanListsHtml(tempKanbanListsHtml)
    }, [boardValues.renderComponent, boardValues.groupsData, renderKanban])

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    })

    function handleDocumentClick(e) {
        if (clickedLablesMenuParentRef.current && !clickedLablesMenuParentRef.current.contains(e.target)) {
            setShowLabelsMenu(false)
            setRenderKanban(prev => !prev)
        }
    }

    return (
        <div className="flex gap-4">
            {kanbanListsHtml}
        </div>
    )
}

export default Kanban