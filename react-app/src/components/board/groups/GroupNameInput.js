import { useState, useRef } from "react"
import GroupColors from "./GroupColors"
import { GoTriangleDown } from "react-icons/go";

function GroupNameInput(props) {

    let groupId = props.groupId    
    let groupNameTextColor = props.currentGroup.color.replace('bg', 'text')

    const [editingGroupName, setEditingGroupName] = useState('')
    const [editingGroupId, setEditingGroupId] = useState('')
    const [isEditingGroupName, setIsEditingGroupName] = useState(false)

    const groupInputRef = useRef([])
    const measureGroupInputRef = useRef([])

    // this is so we can change the group name's input's width dynamically, will fit the width 
    function adjustGroupNameWidth(index) {
        if (groupInputRef.current[index] && measureGroupInputRef.current[index]) {
            measureGroupInputRef.current[index].textContent = groupInputRef.current[index].value
            groupInputRef.current[index].style.width = `${measureGroupInputRef.current[index].offsetWidth + 10}px`
        }
    }

    function editGroupName(groupId) {
        fetch('http://127.0.0.1:8000/board/edit-group-name/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            },
            body: JSON.stringify({
                group_name: editingGroupName,
                group_id: groupId
            })
        })
        .then(res => res.json())
        .then(data => {
            props.setRenderComponent(!props.renderComponent)
        })
    }

    if (!editingGroupName) {
        adjustGroupNameWidth(props.i)
    }

    return (
        <div className={`flex items-center gap-1 group ${isEditingGroupName && `w-full`} w-fit relative`}>

            {/* for color options */}
            {(isEditingGroupName && editingGroupId === groupId) && 
                <GroupColors groupId={groupId} userToken={props.userToken} renderComponent={props.renderComponent} setRenderComponent={props.setRenderComponent}
                        renderGroups={props.renderGroups} setRenderGroups={props.setRenderGroups} currentGroup={props.currentGroup}/>
            }

            <input type="text" 
            className={`text-lg border px-1 py-0 text-center rounded-[4px] border-transparent hover:border-slate-300 focus:outline-none focus:border-sky-600 focus:min-w-[70%] 
                    focus:text-start peer ${(isEditingGroupName && editingGroupId === groupId) && `pl-8`} ${groupNameTextColor} font-medium`}
            value={(isEditingGroupName && editingGroupId === groupId) ? editingGroupName : props.currentGroup.name} 
            ref={(el) => el && groupInputRef.current.push(el)}
            onFocus={(e) => {
                setEditingGroupName(e.target.value)
                setEditingGroupId(groupId)
                setIsEditingGroupName(true)
                props.setRenderGroups(!props.renderGroups)
            }}
            onChange={(e) => {
                setEditingGroupName(e.target.value)
                props.setRenderGroups(!props.renderGroups)
                }}
            onBlur={() => {
                setIsEditingGroupName(false)
                setEditingGroupName('')
                editGroupName(groupId)
                props.setRenderGroups(!props.renderGroups)
            }}
            onKeyDown={(e) => {
                if(e.key === 'Enter') {
                    e.target.blur()
                    setIsEditingGroupName(false)
                    setEditingGroupName('')
                    editGroupName(groupId)
                }
            }}/>
            {!isEditingGroupName && 
                <div 
                    className="absolute scale-0 justify-center bg-slate-700 py-[7px] px-4 rounded-md bottom-10 z-10 min-w-28 shadow-lg
                            peer-hover:flex peer-hover:scale-100 transition ease-in duration-0 peer-hover:duration-100 peer-hover:delay-500">
                    <p className="bg-slate-700 text-white m-0 text-sm">Click to Edit</p>
                    <div className="text-slate-700 absolute top-[25px] text-2xl">
                        <GoTriangleDown/>
                    </div>
                </div>
            }
            <p className={`transition ease-in group-hover:text-slate-400 text-sm text-white w-fit peer-focus:hidden `}>{props.currentGroupsItems.length} Items</p>
            {/* hidden span to measure the length of the input so we can manually set the width */}
            <span ref={(el) => el && measureGroupInputRef.current.push(el)} className="text-lg p-1 px-2 invisible absolute min-w-3"></span>
        </div>
    )
}

export default GroupNameInput