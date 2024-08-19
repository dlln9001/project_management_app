import { useGoogleLogin } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"

function GoogleLogIn() {
    const navigate = useNavigate()

    const login = useGoogleLogin({
        onSuccess: async tokenResponse => {

            try {
                const response = await fetch('http://127.0.0.1:8000/authorize/auth/google/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: tokenResponse.access_token
                    })
                })
                const data = await response.json()
                if (data.status === 'success') {
                    // Handle successful login (e.g., update app state, redirect)
                    console.log(data)
                    localStorage.setItem('userInfo', JSON.stringify(data.user))
                    localStorage.setItem('userToken', JSON.stringify(data.token))
                    navigate('/home')
                  } 
                else {
                    console.error('Login failed');
                }
            }
            catch (error) {
                console.error('Error during login:', error)
            }
        },
        onError: () => console.log('Login Failed')
    })
    
    return (
        <>
            <div onClick={() => login()} className="flex mx-auto p-2 border rounded-md px-28 gap-x-3 border-slate-300 hover:bg-slate-100 items-center cursor-pointer">
                <img src={process.env.PUBLIC_URL + '/svgs/google-color.svg'} alt="" className="max-h-5"/>
                <p>Continue with Google</p>
            </div>
        </>
    )
}

export default GoogleLogIn