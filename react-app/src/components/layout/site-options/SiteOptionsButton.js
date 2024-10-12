import { useState, useEffect, useRef } from 'react'
import SiteOptionsPopup from './SiteOptionsPopup'

function SiteOptionsButton() {
    const name = JSON.parse(localStorage.getItem('userInfo')).name
    const [showPopup, setShowPopup] = useState('')
    const siteOptionsButtonRef = useRef('')

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)
    }, [])

    function handleDocumentClick(e) {
        if (siteOptionsButtonRef.current && !siteOptionsButtonRef.current.contains(e.target)) {
            setShowPopup(false)
        }
    }
    
    return (
        <div ref={siteOptionsButtonRef} className={`ml-auto mx-4 flex rounded-l-sm h-fit w-fit relative items-center px-2 py-1 gap-2 mr-14  cursor-pointer 
            ${showPopup ? `bg-sky-100` : `hover:bg-slate-100 bg-white`}`}
            onClick={() => setShowPopup(true)}>
            <img src={process.env.PUBLIC_URL + 'images/TaskTrackLogoOnlyImage.png'} alt="" className="h-6 mr-4 ml-1"/>
            <div className="absolute right-0 bg-slate-400 rounded-full h-8 w-8 translate-x-4 flex items-center justify-center text-white">
                <p className=" font-medium">{name[0].toUpperCase()}</p>
            </div>
            {showPopup &&
                <SiteOptionsPopup/>
            }
        </div>
    )
}

export default SiteOptionsButton