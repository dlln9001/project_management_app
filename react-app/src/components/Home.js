import { useState } from "react"
import { useUserContext } from "../contexts/UserContext"

function Home() {
    const { userInfo, setUserInfo } = useUserContext()
    const username = JSON.parse(localStorage.getItem('userInfo')).username
    const name = JSON.parse(localStorage.getItem('userInfo')).name
    const token = JSON.parse(localStorage.getItem('userToken'))

    return (
        <div className=" bg-white h-screen rounded-tl-lg p-5">
            home!
            <p>username: {username}</p>
            <p>name: {name}</p>
            <p>token: {token}</p>
        </div>
    )
}

export default Home