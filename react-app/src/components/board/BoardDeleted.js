import { useOutletContext } from "react-router-dom";
import { CiTrash } from "react-icons/ci";

function BoardDeleted(props) {
    const { deletedBoardName, setDeletedBoardName } = useOutletContext()
    return (
        <div className="bg-white h-full rounded-md flex justify-center items-center">
            <div className="flex flex-col items-center gap-5">
                <CiTrash className="text-[200px]"/>
                <p className=" font-medium text-2xl"><span>"{deletedBoardName}"</span> board has been deleted</p>
            </div>
        </div>
    )
}

export default BoardDeleted