import { useState, useRef, useEffect } from "react";
import { useBoardValues } from "../../../contexts/BoardValuesContext"
import LabelsMenu from "./LabelsMenu";

function LabelColumn(props) {
    const boardValues = useBoardValues()

    const [setColumnValueItemId, setSetColumnValueItemId] = useState('')
    const [showMenu, setShowMenu] = useState(false)
    const setColumnValueRef = useRef('')

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)
    }, [])

    function handleDocumentClick(e) {
        if (setColumnValueRef.current && !setColumnValueRef.current.contains(e.target)) {
            setSetColumnValueItemId('')
            boardValues.setRenderGroups(!boardValues.renderGroups)
        }
    }

    return (
        <div ref={setColumnValueRef}
        className={`${props.columnValues[props.k].value_color} min-w-36  cursor-pointer flex relative justify-center items-center
        text-white 
        ${(setColumnValueItemId[0] === props.i && setColumnValueItemId[1] === props.j && setColumnValueItemId[2] === props.k && showMenu) 
            ? `border border-sky-600` 
            : `border-t border-t-slate-300 border-r border-r-slate-300`}`}
        onClick={() => {
                setSetColumnValueItemId([props.i, props.j, props.k])
                setShowMenu(true)
                boardValues.setRenderGroups(!boardValues.renderGroups)
        }}>
            <p>{props.columnValues[props.k].value_text}</p>
            {/* set labels menu */}
            {(setColumnValueItemId[0] === props.i && setColumnValueItemId[1] === props.j && setColumnValueItemId[2] === props.k && showMenu) && 

                <LabelsMenu showMenu={showMenu} setShowMenu={setShowMenu} userToken={props.userToken} columnValues={props.columnValues} k={props.k} associatedColumn={props.associatedColumn}/>
            }
        </div>
    )
}

export default LabelColumn