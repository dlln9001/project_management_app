import GoogleLogIn from "./GoogleLogIn"
import { useState, useRef } from "react"

function SigninPage() {
    const [username, setUsername] = useState('')
    const emailForm = useRef('')

    function continueSignin(e) {
        e.preventDefault()
        const form = e.target
        if (form.checkValidity()) {
            window.location = `create-account?email=${encodeURIComponent(username)}`
        }
        
    }

    return (
        <>
            <form className="flex flex-col items-center justify-center min-h-screen w-fit mx-auto" onSubmit={continueSignin} ref={emailForm}>
                <h1 className="text-center text-3xl mb-10">Welcome to TaskTrack</h1>
                <GoogleLogIn/>
                <div className="flex items-end gap-3 mt-5 w-full justify-center mb-5">
                    <div className=" w-full border-t-slate-300 border-t min-h-4"></div>
                    <p>or</p>
                    <div className=" w-full border-t-slate-300 border-t min-h-4"></div>
                </div>
                <div action="" className="w-full">
                    <input type="email" placeholder="Enter your email" className="border w-full border-slate-300 focus:border-slate-500 focus:outline-none rounded-md p-2"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                    {username
                    ? <button className="w-full bg-b bg-sky-600 hover:bg-sky-700 text-white rounded-md p-2 mt-6">Continue</button>
                    : <button className="w-full bg-b bg-slate-200 text-slate-400 rounded-md p-2 mt-6" disabled>Continue</button>
                    }
                </div>
                <div className="flex gap-2 mt-6">
                    <p>Already have an account?</p>
                    <p className=" text-sky-600 cursor-pointer">Log in</p>
                </div>
            </form>  
        </>
    )
}

export default SigninPage