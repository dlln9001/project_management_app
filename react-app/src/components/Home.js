import { useState, useEffect } from "react"
import { useUserContext } from "../contexts/UserContext"

function Home() {
    const { userInfo, setUserInfo } = useUserContext()
    const username = JSON.parse(localStorage.getItem('userInfo')).username
    const name = JSON.parse(localStorage.getItem('userInfo')).name
    const token = JSON.parse(localStorage.getItem('userToken'))

    useEffect(() => {
        fetch('http://127.0.0.1:8000/workspace-element/get-recently-visited-elements/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        })
        .then(res => res.json())
        .then(data => console.log(data))
    }, [])

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