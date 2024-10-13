import LogOut from "../../authorization/LogOut"
import Profile from "./Profile";
import { IoPersonOutline } from "react-icons/io5";

function SiteOptionsPopup(props) {
    return (
    <>
        <div className="absolute top-10 bg-white w-72 right-0 shadow-all-sides rounded-md p-3 px-4 cursor-default z-20">
            <div className="text-sm flex flex-col gap-2">
                <p className="mb-1 opacity-75 px-3">Account</p>
                <div className="hover:bg-slate-100 flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer" onClick={() => props.setShowProfile(true)}>
                    <div className="text-black text-lg">
                        <IoPersonOutline />
                    </div>
                    <p>
                        My profile
                    </p>
                </div>
                <div className="hover:bg-slate-100 rounded-md cursor-pointer">
                    <LogOut/>
                </div>
            </div>
        </div>
    </>
    )
}

export default SiteOptionsPopup