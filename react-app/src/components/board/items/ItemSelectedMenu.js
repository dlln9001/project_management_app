import { IoMdClose } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import { useBoardValues } from "../../../contexts/BoardValuesContext";

function ItemSelectedMenu(props) {
    const boardValues = useBoardValues()

    function deleteSelectedItems() {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/board/delete-item/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${ props.userToken }`
            },
            body: JSON.stringify({
                item_ids: boardValues.itemSelected
            })
        })
        .then(res => res.json())
        .then(data => boardValues.setRenderComponent(!boardValues.renderComponent))
    }

    return (
        <div className=" shadow-all-sides flex rounded-md h-16 fixed mx-auto left-1/2 transform -translate-x-1/3 w-1/3 bottom-10 bg-white">
            <div className="w-16 bg-sky-600 rounded-l-md text-white text-3xl flex justify-center items-center">
                {boardValues.numberOfItemsSelected}
            </div>
            <div className="px-5 self-center text-xl">
                {boardValues.numberOfItemsSelected === 1
                ? <p>Item selected</p>
                : <p>Items selected</p>
                }
            </div>
            <div className="flex flex-col justify-center w-16 items-center gap-1 ml-auto cursor-pointer group" 
                onClick={() => {
                    deleteSelectedItems()
                    boardValues.setIsItemSelected(false)
                    boardValues.setItemSelected([])
                    boardValues.setGroupsAllSelected([])
                }}>
                <IoTrashOutline className="text-2xl group-hover:text-sky-600"/>
                <p className="text-xs">Delete</p>
            </div>
            <div className="ml-3 w-16 border-l flex justify-center items-center text-xl border-slate-400 cursor-pointer hover:text-sky-600"
            onClick={() => {
                boardValues.setIsItemSelected(false)
                boardValues.setItemSelected([])
                boardValues.setGroupsAllSelected([])
                boardValues.setRenderGroups(!boardValues.renderGroups)
            }}>
                <IoMdClose />
            </div>
        </div>
    )
}

export default ItemSelectedMenu