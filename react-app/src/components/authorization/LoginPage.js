import GoogleLogIn from "./GoogleLogIn"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [incorrectLogin, setIncorrectLogin] = useState(false)
    const navigate = useNavigate()

    function login() {
        fetch('http://127.0.0.1:8000/authorize/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.incorrect_email_or_password) {
                setIncorrectLogin(true)
            }
            else {
                localStorage.setItem('userInfo', JSON.stringify(data.user))
                localStorage.setItem('userToken', JSON.stringify(data.token))
                navigate('/home')
            }
        })
    }

    return (
        <> 
            <div className=" bg-slate-50 border-b border-b-slate-200 absolute top-0 w-full">
                <img src={process.env.PUBLIC_URL + 'images/TaskTrackLogo.png'} alt="" className=" max-h-16 m-2 mx-3"/>
            </div>
            {incorrectLogin && 
                <p className=" bg-red-600 text-white text-center p-2 absolute top-24 w-full">Incorrect email or password</p>
            }
            <div className="flex flex-col mx-auto w-1/3 justify-center items-center mt-44">
                <h1 className=" text-3xl mb-10">Log in</h1>
                <div className="flex self-start flex-col w-3/4 items-end gap-7">
                    <div className="flex flex-col items-start w-full gap-4">
                        <div className="flex items-center w-full justify-end">
                            <p className=" mr-5">Email</p>
                            <input type="email" className=" border border-slate-300 p-2 rounded-md w-2/3 focus:outline-none focus:border-slate-500" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            data-testid='login-email'
                            />
                        </div>
                        <div className="flex items-center w-full justify-end">
                            <p className=" mr-5">Password</p>
                            <input type="password" className=" border border-slate-300 p-2 rounded-md w-2/3 focus:outline-none focus:border-slate-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            data-testid='login-password'/>
                        </div>
                    </div>
                    <button className=" bg-sky-600 text-white content-end rounded-md p-2 text-lg hover:bg-sky-700 mb-7 w-2/3" onClick={login}>Log in</button>
                </div>
                <div className="flex justify-center w-full items-center mb-7">
                    <div className="w-full border-t-slate-300 border-t-2"></div>
                    <p className="text-center whitespace-nowrap mx-5">or sign in with</p>
                    <div className="w-full border-t-slate-300 border-t-2"></div>
                </div>
                <div className=" mb-7">
                    <GoogleLogIn linkNewAccount={false} userToken={-1}/>
                </div>
                <div className="flex gap-2">
                    <p>Don't have an account yet?</p>
                    <p className=" text-sky-600 cursor-pointer" onClick={() => navigate('/signup')}>Sign up</p>
                </div>
            </div>
        </>
    )
}

export default LoginPage