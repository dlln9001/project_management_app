import { useState, useEffect } from "react";
import { useBoardValues } from "../../../contexts/BoardValuesContext"
import LabelColumn from "./LabelColumn";
import NumbersColumn from "./NumbersColumn";
import TextColumn from "./TextColumn";

function ItemColumnValue(props) {
    const boardValues = useBoardValues()
    
    // this is the column that the selected column value is associated with
    const [associatedColumn, setAssociatedColumn] = useState('')

    useEffect(() => {
        const associatedColumnId = props.columnValues[props.k].column
        const columnsInfo = boardValues.groupsData.columnsInfo
        for (let i=0; i < columnsInfo.length; i++) {
            if (columnsInfo[i].id === associatedColumnId) {
                setAssociatedColumn(columnsInfo[i])
                break
            }
        }
    }, [boardValues.renderComponent, boardValues.renderGroups])

    return (
        <>
            {(associatedColumn.column_type === 'Status' || associatedColumn.column_type === 'Priority') &&
                <LabelColumn i={props.i} j={props.j} k={props.k} columnValues={props.columnValues} key={props.k} userToken={props.userToken} associatedColumn={associatedColumn}/>
            }
            {associatedColumn.column_type === 'Numbers' &&
                <NumbersColumn userToken={props.userToken} k={props.k} columnValues={props.columnValues}/>
            }
            {associatedColumn.column_type === 'Text' &&
                <TextColumn userToken={props.userToken} k={props.k} columnValues={props.columnValues}/>
            }
        </>
    )
}

export default ItemColumnValue