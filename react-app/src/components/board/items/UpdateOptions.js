import { FiTrash } from "react-icons/fi";

function UpdateOptions() {
    return (
        <div className=" absolute bg-white rounded-md right-0 p-1 shadow-all-sides w-56">
            <div className="flex items-center gap-2 hover:bg-slate-100 cursor-pointer py-1 px-2 rounded-md text-sm">
                <div>
                    <FiTrash/>
                </div>
                <p>Delete</p>
            </div>
        </div>
    )
}

export default UpdateOptions