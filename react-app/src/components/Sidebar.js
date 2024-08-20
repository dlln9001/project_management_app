import { useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { GrHomeRounded } from "react-icons/gr";
import { PiCalendarCheck } from "react-icons/pi";
import { FaRegStar } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";


function Sidebar() {
    const searchBar = useRef('')

    return (
        <div className=" bg-slate-50 mr-3 rounded-tr-lg w-72 flex flex-col">
            <div className="side-bar-button mb-1 flex items-center gap-2">
                <GrHomeRounded className="text-md ml-[2px]"/>
                <p className=" text-sm text-slate-700">Home</p>
            </div>
            <div className="side-bar-button mb-1 flex items-center gap-2">
                <PiCalendarCheck className="text-xl"/>
                <p className="text-sm text-slate-700">My work</p>
            </div>
            <div className="border-t border-t-slate-300"></div>
            <div className="side-bar-button flex items-center gap-2">
                <FaRegStar className="text-lg ml-[2px]"/>
                <p className="text-sm text-slate-700">Favorites</p>
            </div>
            <div className="border-t border-t-slate-300"></div>
            <div className="flex mx-2 my-2 items-center gap-2 mr-4" onClick={() => searchBar.current.focus()}>
                <div className="p-2 focus:outline-none border border-slate-300 rounded-md text-sm h-[34px] 
                    transition ease-in hover:border-slate-900 cursor-pointer flex gap-2">
                    <CiSearch/>
                    <input type="text" placeholder="Search" ref={searchBar}
                    className=" bg-inherit focus:outline-none cursor-pointer"/>
                </div>
                <div className="border p-1 border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer">
                    <AiOutlinePlus className=" text-2xl"/>
                </div>
            </div>
        </div>
    )
}

export default Sidebar