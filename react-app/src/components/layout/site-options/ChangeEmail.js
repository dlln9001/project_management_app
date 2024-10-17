import { IoIosClose } from "react-icons/io";
import GoogleLogIn from "../../authorization/GoogleLogIn";
import { useState } from "react";
import { useUserContext } from "../../../contexts/UserContext";

function ChangeEmail(props) {
    const { userInfo, setUserInfo } = useUserContext()
    const [emailAlreadyLinked, setEmailAlreadyLinked] = useState(false)
    const [newEmail, setNewEmail] = useState('')
    let google_id = JSON.parse(localStorage.getItem('userInfo')).google_id

    function changeStandardEmail(e) {
        e.preventDefault()
        const form = e.target
        if (form.checkValidity()) {
            fetch('http://127.0.0.1:8000/authorize/change-standard-email/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.userToken}`
                },
                body: JSON.stringify({
                    new_email: newEmail
                })
            }) 
            .then(res => res.json())
            .then(data => {
                if (data.status === 'This account is already linked to another user') {
                    setEmailAlreadyLinked(true)
                }
                else {
                    props.setShowChangeEmail(false)
                    localStorage.setItem('userInfo', JSON.stringify(data.user))
                    setUserInfo(data.user)
                }
                console.log(data)
            })
        }
    }

    return (
        <form className="absolute bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-1/4 px-8 py-5 rounded-xl flex flex-col" onSubmit={changeStandardEmail}>
            <div className=" self-end text-3xl cursor-pointer" onClick={() => props.setShowChangeEmail(false)}>
                <IoIosClose />
            </div>
            <h1 className="text-3xl font-medium mb-4">Change email address</h1>
            <div className="flex gap-12 w-full mb-8 text-slate-700">
                <div>
                    <p className="mb-3">Current email</p>
                    <p className="py-1">New email</p>
                </div>
                <div className=" flex-grow">
                    <p className="mb-3 text-slate-500">{props.username}</p>
                    <div className="border px-2 py-1 rounded-[4px] border-green-700">
                        <input type="email" placeholder="Enter new email address" className="w-full focus:outline-none" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter') {
                                e.target.blur()
                            }
                        }}/>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 ml-auto">
                <button className=" hover:bg-slate-100 py-2 px-4 rounded-md" onClick={() => props.setShowChangeEmail(false)}>Cancel</button>
                {google_id
                ? <GoogleLogIn linkNewAccount={true} emailAlreadyLinked={emailAlreadyLinked} setEmailAlreadyLinked={setEmailAlreadyLinked} showChangeEmail={props.showChangeEmail} 
                    setShowChangeEmail={props.setShowChangeEmail}/>
                : 
                (
                newEmail 
                ? <button className="text-white bg-sky-600 py-2 px-4 rounded-md cursor-pointer">Confirm</button>
                : <button className="text-slate-400 bg-slate-300 py-2 px-4 rounded-md" disabled>Confirm</button>
                )
                }
                
            </div>
            {emailAlreadyLinked &&
                <p className="text-red-600 self-end mt-1 text-sm">Email already linked to another account</p>
            }
        </form>
    )
}

export default ChangeEmail