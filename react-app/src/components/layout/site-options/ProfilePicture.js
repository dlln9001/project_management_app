import {useState, useRef, useEffect} from 'react'
import { BsPersonFillAdd } from "react-icons/bs";
import { MdOutlineFileUpload } from "react-icons/md";
import { FiTrash } from "react-icons/fi";

function ProfilePicture(props) {
    const [showChangePfp, setShowChangePfp] = useState(false)
    const profilePictureRef = useRef('')


    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)
    }, [])

    function handleDocumentClick(e) {
        if (profilePictureRef.current && !profilePictureRef.current.contains(e.target)) {
            setShowChangePfp(false)
        }
    }

    function changePfp(e) {
        const profile_picture = new FormData()
        profile_picture.append('pfp_file', e.target.files[0])
        fetch('http://127.0.0.1:8000/user/change-pfp/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${props.userToken}`,
            },
            body: profile_picture
        })
        .then(res => res.json())
        .then(data => {
            if (data.user) {
                localStorage.setItem('userInfo', JSON.stringify(data.user))
                props.setPfpUrl('http://127.0.0.1:8000' + JSON.parse(localStorage.getItem('userInfo')).profile_picture)
                setShowChangePfp(false)
            }
        })
    }

    function removePfp(e) {
        fetch('http://127.0.0.1:8000/user/delete-pfp/', {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.user) {
                localStorage.setItem('userInfo', JSON.stringify(data.user))
                props.setPfpUrl('')
                setShowChangePfp(false)
            }
        })
    }

    return (
        <div className='flex flex-col items-center relative' ref={profilePictureRef}>
            <div className=' h-36 w-36 bg-white rounded-full flex items-center justify-center text-white font-medium relative cursor-pointer group'
                onClick={() => setShowChangePfp(true)}>
                {props.is_default_profile_picture 
                ? <p className=' text-7xl bg-slate-400 w-full h-full rounded-full flex justify-center items-center'>{props.name[0] && props.name[0].toUpperCase()}</p>
                : <img src={props.pfpUrl} alt="" className=' rounded-full object-cover h-full w-full' />
                }
                <div className='absolute bg-black opacity-60 h-full w-full rounded-full invisible group-hover:visible'></div>
                <div className='absolute text-center flex flex-col justify-center items-center w-2/3 invisible group-hover:visible'>
                    <div className='text-6xl'>
                        <BsPersonFillAdd />
                    </div>
                    <p className='text-xs'>Change profile picture</p>
                </div>
            </div>
            {showChangePfp &&
                <div className='absolute bg-white shadow-all-sides top-32 rounded-md text-black w-44 p-1 flex flex-col gap-2'>
                    <form action="">
                        <label htmlFor="choose-profile-pic" className='flex gap-2 hover:bg-slate-100 cursor-pointer px-2 py-1 rounded-sm'>
                            <MdOutlineFileUpload />
                            <p className='text-xs'>Upload a profile picture</p>
                        </label>
                        <input type="file" accept='image/*' className='hidden' id='choose-profile-pic' onChange={changePfp}/>
                    </form>
                    <div className='flex gap-2 hover:bg-slate-100 cursor-pointer px-2 py-1 rounded-sm' onClick={removePfp}>
                        <FiTrash />
                        <p className='text-xs'>Remove profile picture</p>
                    </div>
                </div>
            }
        </div>
    )
}

export default ProfilePicture