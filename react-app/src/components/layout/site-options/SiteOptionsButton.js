import { useState, useEffect, useRef } from 'react'
import SiteOptionsPopup from './SiteOptionsPopup'
import Profile from './Profile'
import Invites from './Invites'

function SiteOptionsButton() {
    const name = JSON.parse(localStorage.getItem('userInfo')).name
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const is_default_profile_picture = JSON.parse(localStorage.getItem('userInfo')).is_default_profile_picture
    const [showPopup, setShowPopup] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [showInvites, setShowInvites] = useState(false)
    const [pfpUrl, setPfpUrl] = useState(`${process.env.REACT_APP_MEDIA_BASE_URL}` + JSON.parse(localStorage.getItem('userInfo')).profile_picture)
    const siteOptionsButtonRef = useRef('')
    const userToken = JSON.parse(localStorage.getItem('userToken'))

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)
    }, [])

    function handleDocumentClick(e) {
        if (siteOptionsButtonRef.current && !siteOptionsButtonRef.current.contains(e.target)) {
            setShowPopup(false)
        }
    }
    
    return (
        <>
            <div ref={siteOptionsButtonRef} className={`ml-auto mx-4 flex rounded-l-sm h-fit w-fit relative items-center px-2 py-1 gap-2 mr-10  cursor-pointer 
                ${ showPopup? `bg-sky-100` : `hover:bg-slate-100 bg-white`} `}
                onClick={() => setShowPopup(true)}>
                <img src={process.env.PUBLIC_URL + 'images/TaskTrackLogoOnlyImage.png'} alt="" className="h-6 mr-4 ml-1"/>
                <div className="absolute right-0 bg-white rounded-full h-8 w-8 translate-x-4 flex items-center justify-center text-white">
                    {is_default_profile_picture 
                    ? <p className=" font-medium bg-slate-400 w-full h-full rounded-full flex justify-center items-center">{name[0].toUpperCase()}</p>
                    : <img src={pfpUrl} alt="" className='rounded-full object-cover h-full w-full'/>
                    }
                </div>
                {showPopup &&
                    <SiteOptionsPopup showProfile={showProfile} setShowProfile={setShowProfile} setShowInvites={setShowInvites}/>
                }
            </div>
            {showProfile &&
                <Profile showProfile={showProfile} setShowProfile={setShowProfile} is_default_profile_picture={is_default_profile_picture} pfpUrl={pfpUrl} setPfpUrl={setPfpUrl}/>
            }
            {showInvites &&
                <Invites setShowInvites={setShowInvites} userToken={userToken} userInfo={userInfo}/>
            }
        </>
    )
}

export default SiteOptionsButton