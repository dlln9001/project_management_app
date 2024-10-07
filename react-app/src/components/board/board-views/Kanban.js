import { useEffect, useState } from "react"
import { useBoardValues } from "../../../contexts/BoardValuesContext"
import { getStatusColumnValues } from "../columns/LabelsMenu"


function Kanban() {
    const boardValues = useBoardValues()
    const [kanbanListsHtml, setKanBanListsHtml] = useState('')
    const statusColumnValues = getStatusColumnValues(-1)
    const groupsData = boardValues.groupsData
    
    useEffect(() => {
        let statusColumnOrder = 'no order'
        let priorityColumnOrder = 'no order'

        for (let i=0; i < groupsData.columnsInfo.length; i++) {
            if (groupsData.columnsInfo[i].column_type === 'Status') {
                statusColumnOrder = groupsData.columnsInfo[i].order
            }
            else if (groupsData.columnsInfo[i].column_type === 'Priority') {
                priorityColumnOrder = groupsData.columnsInfo[i].order
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
                        let priorityValueColor = flat_columnValues[j][priorityColumnOrder].value_color.replace('bg-', '')
                        num_of_items += 1
                        // columnvalues and itemsinfo both have same indexes that refer to the same item
                        itemsHtml.push(
                            <div key={j} className="bg-white border border-slate-300 rounded-md p-2 min-h-20">
                                <p>
                                    {flat_itemsInfo[j].name}
                                </p>
                                    <div className="flex gap-2"> 
                                        {statusColumnValues[i].text != '' &&
                                            <div className={`text-sm mt-2 bg-slate-100 w-fit px-2 py-[1px] border-${columnValueColor} border-l-4 rounded-sm`}>
                                                <p>
                                                    {statusColumnValues[i].text}
                                                </p>
                                            </div>
                                        }
                                        {flat_columnValues[j][priorityColumnOrder].value_text != '' &&
                                            <div className={`text-sm mt-2 bg-slate-100 w-fit px-2 py-[1px] border-${priorityValueColor} border-l-4 rounded-sm`}>
                                                <p>
                                                    {flat_columnValues[j][priorityColumnOrder].value_text}
                                                </p>
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
                        <div className=" bg-slate-50 h-[600px] p-3 flex flex-col gap-2 rounded-b-md overflow-auto custom-scrollbar-small">
                            {itemsHtml}
                        </div>
                    </div>
                )
            }
            }
            else {
                tempKanbanListsHtml.push(
                    <p className=" font-bold text-lg my-5">
                        Add a status column to see your Kanban
                    </p>
                )
            }

        setKanBanListsHtml(tempKanbanListsHtml)
    }, [boardValues.renderComponent, boardValues.groupsData])

    return (
        <div className="flex gap-4">
            {kanbanListsHtml}
        </div>
    )
}

export default Kanban