import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FavoritedOptions from "./FavoritedOptions";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { FaRegStar } from "react-icons/fa";
import { GrDocumentText } from "react-icons/gr";
import { BsThreeDots } from "react-icons/bs";


export function getFavorites(setFavoritesData, userToken) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/workspace-element/get-favorites/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${ userToken }`
        }
    })
    .then(res => res.json())
    .then(data => {
        setFavoritesData(data.favorites)
    })
}


function Favorites(props) {
    const navigate = useNavigate()
    const [workspaceItemOptionsId, setWorkspaceItemOptionsId] = useState('')

    const [favoritesExpanded, setFavoritesExpanded] = useState(false)
    const [favoritesData, setFavoritesData] = useState('')
    const favoritedOptionsRef = useRef('')
    const [favoriteOptionsPosition, setFavoriteOptionsPosition] = useState({top: 0, left: 0})

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }

    }, [])

    useEffect(() => {
        getFavorites(setFavoritesData, props.userToken)
    }, [favoritesExpanded, props.workspaceElementData])

    function handleDocumentClick() {
        setWorkspaceItemOptionsId('')
    }

    function setOptionsPosition(e) {
        const threeDotsRect = e.target.getBoundingClientRect()
        setFavoriteOptionsPosition({
            top: threeDotsRect.top + 20,
            left: threeDotsRect.left
        })
    }

    return (
        <div className={`transition-all duration-200 overflow-auto custom-scrollbar ${ favoritesExpanded? `h-[1000px]` : `h-11`} `}>
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
                <div>
                    {favoritesData &&
                        favoritesData.map((item, i) => {
                            let selectedWorkspaceItem = JSON.parse(localStorage.getItem('selectedWorkspaceItem'))

                            return (
                                <div key={i} 
                                className={`bar-button text-sm flex items-center gap-2 group relative 
                                    ${ workspaceItemOptionsId === i && `bg-slate-200` } 
                                    ${ (selectedWorkspaceItem.type === item.element_type && selectedWorkspaceItem.id === item.id) ? `bg-sky-100` : `` } `}                    
                                onClick={() => {

                                    if (item.element_type === 'board') {
                                        navigate(`board?id=${encodeURIComponent(item.id)}`)
                                    }
                                    else if (item.element_type === 'document') {
                                        navigate(`docs?id=${encodeURIComponent(item.id)}`)
                                    }
                                    
                                    localStorage.setItem('selectedWorkspaceItem', JSON.stringify({ type: item.element_type, id: item.id }))
                                    props.setRenderSideBar(prev => !prev)
                                }}>
                                
                                    {item.element_type === 'board'
                                    ? <img src={process.env.PUBLIC_URL + 'images/boardsIcon.png'} alt="" className="h-4" />
                                    : <GrDocumentText />
                                    }
                                    
                                    <p className=" truncate">{item.element_name}</p>
                                    
                                    <div className="relative ml-auto" ref={favoritedOptionsRef}>
                                        <div 
                                            className={`group-hover:text-inherit  p-1 rounded-md 
                                                    ${ workspaceItemOptionsId === i ? `text-inherit hover:bg-sky-200 bg-sky-200` : `text-transparent hover:bg-neutral-300` } `}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setOptionsPosition(e)
                                                setWorkspaceItemOptionsId(i)
                                                props.setRenderSideBar(!props.renderSideBar)
                                            }}>
                                            <div>
                                                <BsThreeDots/>
                                            </div>
                                        </div>

                                        {workspaceItemOptionsId === i &&
                                            <FavoritedOptions 
                                                userToken={props.userToken} 
                                                setWorkspaceItemOptionsId={setWorkspaceItemOptionsId}
                                                itemData={item}
                                                setRenderSideBar={props.setRenderSideBar}
                                                optionsPosition={favoriteOptionsPosition}
                                                />
                                        }
                                    </div>

                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}

export default Favorites