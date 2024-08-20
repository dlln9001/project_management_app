import { useState } from "react"
import LogOut from "./LogOut"

function Home() {
    const [username, setUsername] = useState(JSON.parse(localStorage.getItem('userInfo')).username)
    const [name, setName] = useState(JSON.parse(localStorage.getItem('userInfo')).name)
    const [token, setToken] = useState(localStorage.getItem('userToken'))

    return (
        <div className=" bg-white h-screen rounded-tl-lg p-5">
            home!
            <p>username: {username}</p>
            <p>name: {name}</p>
            <p>token: {token}</p>
            <LogOut/>
        </div>
    )
}

export default Home