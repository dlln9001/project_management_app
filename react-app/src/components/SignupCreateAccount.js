import { useState, useRef, useEffect } from "react"
import { useLocation } from "react-router-dom"

function SignupCreateAccount() {
    const fullNameElement = useRef('')
    const [emptyName, setEmptyName] = useState(false)
    const [fullName, setFullName] = useState('')
    const [password, setPassword] = useState('')
    const [shortPass, setShortPass] = useState(false)
    const query = new URLSearchParams(useLocation().search)
    const email = query.get('email')
    
    useEffect(() => {
        fullNameElement.current.focus()
    }, [])

    function checkNameInput() {
        if (!fullName) {
            setEmptyName(true)
        }
        else {
            setEmptyName(false)
        }
    }

    function checkPassInput() {
        if (password.length < 8) {
            setShortPass(true)
        }
        else {
            setShortPass(false)
        }
    }

    function signin(e) {
        e.preventDefault()
        fetch('http://127.0.0.1:8000/authorize/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: fullName,
                password: password,
                username: email
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            localStorage.setItem('userInfo', JSON.stringify(data.user))
            localStorage.setItem('userToken', JSON.stringify(data.token))
            window.location = 'home'
        })
    }

    return (
        <div className="flex flex-col w-1/3 mx-auto h-screen mt-44">
            <img src={process.env.PUBLIC_URL + '/images/TaskTrackLogo.png'} alt="" className=" w-64"/>
            <p className=" text-3xl mt-10 mb-5">Create your account</p>
            <form action="" className="flex flex-col" onSubmit={signin}>
                <div className="mb-5">   
                    <p className=" text-slate-500 text-sm mb-2">Full name</p>
                    <input type="text" 
                    className={`border ${emptyName ? `border-red-600` : `border-slate-300`}
                    ${emptyName ? `focus:border-red-600` : `focus:border-slate-500`}  focus:outline-none rounded-md p-3 w-full`} 
                    placeholder="Enter your full name" 
                    ref={fullNameElement}
                    value={fullName}    
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={checkNameInput}/>
                    {emptyName &&
                        <p className=" text-red-600 text-sm mt-1">Enter your full name</p>
                    }
                </div>
                <div>
                    <p className=" text-slate-500 text-sm mb-2">Password</p>
                    <input type="password" className={`border ${shortPass ? `border-red-600` : `border-slate-300`}  focus:outline-none rounded-md p-3 w-full
                    ${shortPass ? `focus:border-red-600` : `focus:border-slate-500`}`}
                    placeholder="Enter at least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={checkPassInput}/>
                    {shortPass &&
                        <p className=" text-red-600 text-sm mt-1">Password must be 8 characters or more</p>
                    }
                </div>
                {(fullName && !(password.length < 8)) 
                ? <button className=" bg-sky-600 cursor-pointer hover:bg-sky-700 text-white rounded-md px-10 p-2 mt-4 w-fit">Sign up</button>
                : <button className=" bg-slate-200 text-slate-400 rounded-md px-10 p-2 mt-4 w-fit cursor-default" disabled>Sign up</button>
                }
            </form>
        </div>
    )   
}

export default SignupCreateAccount