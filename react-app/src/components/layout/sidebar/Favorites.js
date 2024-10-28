import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { FaRegStar } from "react-icons/fa";


function Favorites() {
    const [favoritesExpanded, setFavoritesExpanded] = useState(false)

    return (
        <div className={`transition-all duration-200 ${favoritesExpanded ? `h-[700px]` : `h-11`}`}>
            <div className="bar-button flex items-center gap-2" onClick={() => setFavoritesExpanded(prev => !prev)}>
                <FaRegStar className="text-lg ml-[2px]" />
                <p className="text-sm text-slate-700">Favorites</p>
                <div className=" ml-auto mr-1">
                    {favoritesExpanded 
                    ? <IoIosArrowUp />
                    : <IoIosArrowDown />
                    }
                </div>
            </div>
            {favoritesExpanded &&
                <div>Favorites</div>
            }
        </div>
    )
}

export default Favorites