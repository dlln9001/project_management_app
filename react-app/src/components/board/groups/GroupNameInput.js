import { useState, useRef, useEffect } from "react"
import GroupColors from "./GroupColors"
import { GoTriangleDown } from "react-icons/go";
import { useBoardValues } from "../../../contexts/BoardValuesContext";

function GroupNameInput(props) {
    const boardValues = useBoardValues()

    let groupId = props.groupId
    let groupNameTextColor = props.currentGroup.color.replace('bg', 'text')

    const [editingGroupName, setEditingGroupName] = useState('')
    const [editingGroupId, setEditingGroupId] = useState('')
    const [isEditingGroupName, setIsEditingGroupName] = useState(false)

    const groupInputRef = useRef('')
    const measureGroupInputRef = useRef('')

    const [updated, setUpdated] = useState(0)

    if (!editingGroupName && updated <= 5) {
        adjustGroupNameWidth()
    }

    useEffect(() => {
        setUpdated(0)
    }, [props.boardId])

    // this is so we can change the group name's input's width dynamically, will fit the width 
    function adjustGroupNameWidth() {
        if (groupInputRef.current && measureGroupInputRef.current) {
            measureGroupInputRef.current.textContent = groupInputRef.current.value
            groupInputRef.current.style.width = `${measureGroupInputRef.current.offsetWidth + 10}px`
            let addUpdate = updated + 1
            setUpdated(addUpdate)
        }
    }

    function editGroupName(groupId, groupName) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/board/edit-group-name/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${ props.userToken }`
            },
            body: JSON.stringify({
                group_name: groupName,
                group_id: groupId
            })
        })
        .then(res => res.json())
        .then(data => {
            boardValues.setRenderComponent(!boardValues.renderComponent)
            boardValues.setRenderGroups(!boardValues.renderGroups)
            setUpdated(0)
        })
    }

    return (
        <div className={`flex items-center gap-1 group ${ isEditingGroupName && `w-full`} w-fit relative`}>

            {/* for color options */}
            {(isEditingGroupName && editingGroupId === groupId) && 
                <GroupColors groupId={groupId} userToken={props.userToken} currentGroup={props.currentGroup}/>
            }

            <input type="text" 
            className={`text-lg border px-1 py-0 text-center rounded-[4px] border-transparent hover:border-slate-300 focus:outline-none focus: border-sky-600 focus: min-w-[70 %]
    focus:text-start peer ${ (isEditingGroupName && editingGroupId === groupId) && `pl-8` } ${ groupNameTextColor } font-medium`}
            value={(isEditingGroupName && editingGroupId === groupId) ? editingGroupName : props.currentGroup.name} 
            ref={groupInputRef}
            onFocus={(e) => {
                setEditingGroupName(e.target.value)
                setEditingGroupId(groupId)
                setIsEditingGroupName(true)
                boardValues.setRenderGroups(!boardValues.renderGroups)
            }}
            onChange={(e) => {
                setEditingGroupName(e.target.value)
                boardValues.setRenderGroups(!boardValues.renderGroups)
                }}
            onBlur={(e) => {
                setIsEditingGroupName(false)
                setEditingGroupName(e.target.value)
                setEditingGroupId('')
                adjustGroupNameWidth()
                editGroupName(groupId, e.target.value)
            }}
            onKeyDown={(e) => {
                if(e.key === 'Enter') {
                    e.target.blur()
                    setIsEditingGroupName(false)
                    setEditingGroupName(e.target.value)
                    setEditingGroupId('')
                    adjustGroupNameWidth()
                    editGroupName(groupId, e.target.value)
                }
            }}/>
            {!isEditingGroupName && 
                <div 
                    className={`absolute scale-0 justify-center bg-slate-700 py-[7px] px-4 rounded-md bottom-10 z-20 min-w-28 shadow-lg
    peer-hover:flex peer-hover:scale-100 transition ease-in duration-0 peer-hover:duration-100 peer-hover:delay-500`}>
                    <p className="bg-slate-700 text-white m-0 text-sm">Click to Edit</p>
                    <div className="text-slate-700 absolute top-[25px] text-2xl">
                        <GoTriangleDown/>
                    </div>
                </div>
            }
            <p className={`transition ease-in group-hover:text-slate-400 text-sm text-white w-fit peer-focus:hidden`}>{props.currentGroupsItems.length} Items</p>
            {/* hidden span to measure the length of the input so we can manually set the width */}
            <span ref={measureGroupInputRef} className="text-lg p-1 px-2 invisible absolute min-w-3"></span>
        </div>
    )
}

export default GroupNameInput