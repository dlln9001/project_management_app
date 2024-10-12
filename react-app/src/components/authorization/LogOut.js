import { googleLogout } from'@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { CiLogout } from "react-icons/ci";

function LogOut() {
    const navigate = useNavigate()
    
    function logout() {
        googleLogout()
        localStorage.removeItem('userInfo')
        localStorage.removeItem('userToken')
        navigate('/')
    }
    return (
        <div onClick={() => logout()} className="flex gap-2 items-center px-3 py-2">
            <div className="text-black text-lg">
                <CiLogout />
            </div>
            <button>
                Log out 
            </button> 
        </div>
    ) 
} 
 
export default LogOut 