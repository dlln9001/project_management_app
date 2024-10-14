import ReactDOM from 'react-dom'
import { IoIosClose } from "react-icons/io";
import { CiMail } from "react-icons/ci";
import {useState, useRef, useEffect} from 'react'
import ProfilePicture from './ProfilePicture';

function Profile(props) {
    const name = JSON.parse(localStorage.getItem('userInfo')).name
    const username = JSON.parse(localStorage.getItem('userInfo')).username
    const userToken = JSON.parse(localStorage.getItem('userToken'))


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
                        <ProfilePicture userToken={userToken} is_default_profile_picture={props.is_default_profile_picture} pfpUrl={props.pfpUrl} setPfpUrl={props.setPfpUrl} name={name}/>
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