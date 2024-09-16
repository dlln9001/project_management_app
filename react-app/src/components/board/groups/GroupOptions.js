import { useState, useRef, useEffect } from "react"
import { BsThreeDots } from "react-icons/bs";
import { FiTrash } from "react-icons/fi";

function GroupOptions(props) {
    const [showGroupOptions, setShowGroupOptions] = useState(false)
    const [groupOptionsId, setGroupOptionsId] = useState('') // id of the group
    const groupOptionsRef = useRef('')
    console.log(showGroupOptions)
    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)
    }, [])

    function handleDocumentClick(e) {
        // closes out the group options
        if (groupOptionsRef.current && !groupOptionsRef.current.contains(e.target)) {
            setShowGroupOptions(false)
            setGroupOptionsId('')
            props.setRenderGroups(!props.renderGroups)
        }
    }

    function deleteGroup() {
        fetch('http://127.0.0.1:8000/board/delete-group/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`,
            },
            body: JSON.stringify({
                group_id: props.groupId,
                board_id: props.boardId
            })
        })
        .then(res => res.json())
        .then(data => props.setRenderComponent(!props.renderComponent))
    }
    console.log(props.boardId)
    return (
        <div ref={groupOptionsId === props.groupId ? groupOptionsRef : null} className={`absolute left-3 group-hover:text-inherit  p-1 rounded-md cursor-pointer 
            ${showGroupOptions && groupOptionsId === props.groupId ? `bg-sky-200 text-inherit` : `hover:bg-slate-300 text-white`}`}
            onClick={() => {
               setShowGroupOptions(true)
               setGroupOptionsId(props.groupId)
               props.setRenderGroups(!props.renderGroups)
           }}>
           <BsThreeDots />

           {(showGroupOptions && groupOptionsId === props.groupId) && 
               <div 
                   className="absolute left-7 top-0 bg-white z-10 shadow-all-sides w-60 text-slate-600 text-sm p-2 rounded-lg">
                   <div className="group-options-button" onClick={() => deleteGroup(props.groupId)}>
                       <FiTrash className="mx-2 my-1"/>
                       <p>Delete</p>
                   </div>
               </div>
           }
           
       </div>
    )
}

export default GroupOptions