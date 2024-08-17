import { googleLogout } from'@react-oauth/google'

function LogOut() {
    function logout() {
        googleLogout()
        localStorage.removeItem('userInfo')
    }
    return (
        <button onClick={() => logout()}>
            Log out
        </button>
    )
}

export default LogOut