import React, { useState, useContext, createContext } from 'react'

const UserContext = createContext()

export function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState('')

    let values = {
        userInfo, setUserInfo
    }

    return (
        <UserContext.Provider value={values}>
            { children }
        </UserContext.Provider>
    )
}

export function useUserContext() {
    return useContext(UserContext)
}