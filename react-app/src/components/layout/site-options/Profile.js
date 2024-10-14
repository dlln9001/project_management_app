import ReactDOM from 'react-dom'
import { IoIosClose } from "react-icons/io";
import { CiMail } from "react-icons/ci";
import { BsPersonFillAdd } from "react-icons/bs";
import { MdOutlineFileUpload } from "react-icons/md";
import { FiTrash } from "react-icons/fi";
import {useState, useRef, useEffect} from 'react'

function Profile(props) {
    const name = JSON.parse(localStorage.getItem('userInfo')).name
    const username = JSON.parse(localStorage.getItem('userInfo')).username
    const token = JSON.parse(localStorage.getItem('userToken'))
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
                'Authorization': `Token ${token}`,
            },
            body: profile_picture
        })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem('userInfo', JSON.stringify(data.user))
            props.setPfpUrl('http://127.0.0.1:8000' + JSON.parse(localStorage.getItem('userInfo')).profile_picture)
            setShowChangePfp(false)
        })
    }

    function removePfp(e) {
        fetch('http://127.0.0.1:8000/user/delete-pfp/', {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem('userInfo', JSON.stringify(data.user))
            props.setPfpUrl('')
            setShowChangePfp(false)
        })
    }

    return document.getElementById('portal-root') ? ReactDOM.createPortal (
        <>
            <div className="absolute top-0 h-full w-full bg-black opacity-50 z-30" onClick={() => props.setShowProfile(false)}></div>
            <div className="top-9 left-12 absolute bg-white z-40 h-[calc(100vh-2.25rem)] w-[95%] rounded-t-xl">
                <div className="border-b border-b-slate-300 pt-6 px-7">
                    <div className="ml-auto text-4xl absolute right-4 top-3 cursor-pointer" onClick={() => props.setShowProfile(false)}>
                        <IoIosClose />
                    </div>
                    <p className="text-3xl font-medium mb-6">Profile</p>
                </div>
                <div className="border border-slate-300 m-5 h-60 rounded-lg p-7 flex">
                    <div className='flex'>
                        <div className='flex flex-col items-center relative' ref={profilePictureRef}>
                            <div className=' h-36 w-36 bg-white rounded-full flex items-center justify-center text-white font-medium relative cursor-pointer group'
                                onClick={() => setShowChangePfp(true)}>
                                {props.is_default_profile_picture 
                                ? <p className=' text-7xl bg-slate-400 w-full h-full rounded-full flex justify-center items-center'>{name[0].toUpperCase()}</p>
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
                        <div className="ml-5 border border-transparent hover:border-slate-300 rounded-sm px-2 py-[2px] font-medium text-3xl has-[:focus]:border-sky-600 h-fit">
                            <input type="text" className="focus:outline-none" value={name} />
                        </div>
                    </div>
                    <div className="ml-auto">
                        <div className="flex gap-2 items-center">
                            <CiMail className="text-lg" />
                            <p className="font-medium">Email</p>
                        </div>
                        <div className="border border-transparent hover:border-slate-300 rounded-sm px-2">
                            <input type="text" className="focus:outline-none" value={username} />
                        </div>
                    </div>
                </div>
            </div>
        </>
        ,
        document.getElementById('portal-root')
    ) : null
}

export default Profile