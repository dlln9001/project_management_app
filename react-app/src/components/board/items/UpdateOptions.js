import { useEffect, useRef } from "react";
import { FiTrash } from "react-icons/fi";


function UpdateOptions(props) {
    
    function deleteItemUpdate() {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/board/delete-item-update/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            },
            body: JSON.stringify({
                item_update_id: props.itemUpdateId
            })
        })
        .then(res => res.json())
        .then(data => {
            props.setUpdateOptionsIndex(false)
            props.setUpdateData(prev => !prev)
        })
    }

    return (
        <div className=" absolute bg-white rounded-md right-0 p-1 shadow-all-sides w-56">
            <div className="flex items-center gap-2 hover:bg-slate-100 cursor-pointer py-1 px-2 rounded-md text-sm" onClick={deleteItemUpdate}>
                <div>
                    <FiTrash/>
                </div>
                <p>Delete</p>
            </div>
        </div>
    )
}

export default UpdateOptions