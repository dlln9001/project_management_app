import { useState } from "react"
import { useCreateElement } from "../../contexts/CreateWorkspaceItemContext"

function CreateWorkspaceItem() {
    const { itemType, setItemType, showCreateWorkspaceItem, setShowCreateWorkspaceItem } = useCreateElement()
    const lowerItemType = itemType.toLowerCase()
    const [itemName, setItemName] = useState(`New ${itemType}`)
    const userToken = JSON.parse(localStorage.getItem('userToken'))

    function createItem() {
        fetch(`http://127.0.0.1:8000/workspace-element/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`,
            },
            body: JSON.stringify({
                element_name: itemName,
                element_type: lowerItemType,
            }
            )
        })
            .then(res => res.json())
            .then(data => setShowCreateWorkspaceItem(false))
    }

    return (
        <>
            <div className=" bg-white w-[500px] z-40 p-8 rounded-lg flex flex-col shadow-all-sides">
                <p className=" text-3xl text-slate-700">Create {lowerItemType}</p>
                <div className="mt-7 mb-7">
                    <p className="text-sm text-slate-600 mb-2">{itemType} name</p>
                    <input type="text" placeholder={'New ' + itemType + ' name'}
                        className="border-2 w-full p-2 text-slate-700 rounded-md focus:outline-none focus:border-sky-500 border-x-[1px]"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)} />
                </div>
                <div className="flex gap-2 self-end">
                    <button className="text-slate-600 hover:bg-slate-100 p-2 px-3 rounded-md" onClick={() => setShowCreateWorkspaceItem(false)}>Cancel</button>
                    <button className="bg-sky-600 text-white p-2 px-3 rounded-md hover:bg-sky-700" onClick={createItem}>Create {itemType}</button>
                </div>
            </div>
        </>
    )
}

export default CreateWorkspaceItem