import { googleLogout } from'@react-oauth/google'
import { useNavigate } from 'react-router-dom'

function LogOut() {
    const navigate = useNavigate()

    function logout() {
        googleLogout()
        localStorage.removeItem('userInfo')
        localStorage.removeItem('userToken')
        navigate('/')
    }
    return (
        <button onClick={() => logout()}>
            Log out
        </button>
    )
}

export default LogOut