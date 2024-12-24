import { useState, useEffect } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import NotificationsPanel from "./NotificationsPanel";
import useWebSocket, { ReadyState } from 'react-use-websocket';

function NotificationButton() {
    const [showNotifications, setShowNotifications] = useState(false)
    const userToken = JSON.parse(localStorage.getItem('userToken'))
    const [unreadNotifications, setUnreadNotifications] = useState([])
    const [numOfNotificatinos, setNumOfNotifications] = useState(0)

    const [updateUnreadNotifications, setUpdateUnreadNotifications] = useState(false)


    const { sendMessage, lastMessage, readyState } = useWebSocket(process.env.REACT_APP_WS_BASE_URL + '/notifications/' + `?token=${userToken}`)

    
    useEffect(() => {
        getUnreadNotifications()
    }, [updateUnreadNotifications])

    useEffect(() => {
        if (lastMessage && JSON.parse(lastMessage.data).type === 'notification') {
            setNumOfNotifications(prev => prev + 1)
        }
    }, [lastMessage])

    function getUnreadNotifications() {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/notifications/get-unread-notifications/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setUnreadNotifications(data.unread_notifications)
            setNumOfNotifications(data.unread_notifications.length)
        })
    }

    return (
        <>
        <div 
            className={`ml-auto text-xl mr-2 hover:bg-slate-300 cursor-pointer rounded-md relative p-2 ${showNotifications ? `bg-slate-300` : ``}`} 
            onClick={() => setShowNotifications(true)}>
            <IoMdNotificationsOutline />
            <div className="w-4 h-4 bg-white rounded-full absolute top-0 right-0 text-xs flex justify-center items-center">{numOfNotificatinos}</div>
        </div>
        {showNotifications &&
            <NotificationsPanel 
                setShowNotifications={setShowNotifications} 
                userToken={userToken}
                setUpdateUnreadNotifications={setUpdateUnreadNotifications}/>
        }
        </>
    )
}

export default NotificationButton