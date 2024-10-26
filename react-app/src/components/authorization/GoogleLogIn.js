import { useGoogleLogin } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../../contexts/UserContext"

function GoogleLogIn(props) {
    const navigate = useNavigate()
    const { userInfo, setUserInfo } = useUserContext()
    let googleEmail
    let googleId
    let userId

    if(props.linkNewAccount) {
        googleEmail = JSON.parse(localStorage.getItem('userInfo')).email
        googleId = JSON.parse(localStorage.getItem('userInfo')).google_id
        userId = JSON.parse(localStorage.getItem('userInfo')).id
    }

    const login = useGoogleLogin({
        onSuccess: async tokenResponse => {

            try {
                const response = await fetch('http://127.0.0.1:8000/authorize/auth/google/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${props.userToken}`
                    },
                    body: JSON.stringify({
                        token: tokenResponse.access_token,
                        google_email: googleEmail,
                        google_id: googleId,
                        link_new_account: props.linkNewAccount,
                        user_id: userId
                    })
                })
                const data = await response.json()
                if (data.status === 'success') {
                    // Handle successful login (e.g., update app state, redirect)
                    console.log(data)
                    localStorage.setItem('userInfo', JSON.stringify(data.user))
                    localStorage.setItem('userToken', JSON.stringify(data.token))
                    localStorage.setItem('selectedWorkspaceItem', JSON.stringify({type: 'home', id: 0}))
                    setUserInfo(data.user)
                    if (props.linkNewAccount) {
                        props.setShowChangeEmail(false)
                    }
                    navigate('/home')
                  } 
                if (data.status === 'This Google account is already linked to another user') {
                    props.setEmailAlreadyLinked(true)
                }
                else {
                    console.error('Login failed');
                    console.log(data)
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
            {props.linkNewAccount
            ? <div onClick={() => login()} className="text-white bg-sky-600 py-2 px-4 rounded-md cursor-pointer">Confirm</div>
            :
            <div onClick={() => login()} className="flex mx-auto p-2 border rounded-md px-28 gap-x-3 border-slate-300 hover:bg-slate-100 items-center cursor-pointer">
                <img src={process.env.PUBLIC_URL + '/svgs/google-color.svg'} alt="" className="max-h-5"/>
                <p>Continue with Google</p>
            </div>
            }
        </>
    )
}

export default GoogleLogIn