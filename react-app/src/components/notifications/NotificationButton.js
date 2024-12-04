import { useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import NotificationsPanel from "./NotificationsPanel";
import useWebSocket, { ReadyState } from 'react-use-websocket';

function NotificationButton() {
    const [showNotifications, setShowNotifications] = useState(false)

    const { sendMessage, lastMessage, readyState } = useWebSocket(process.env.REACT_APP_WS_BASE_URL)
    
    sendMessage('hello')

    return (
        <>
        <div 
            className={`ml-auto text-xl mr-2 hover:bg-slate-300 cursor-pointer rounded-md p-2 ${showNotifications ? `bg-slate-300` : ``}`} 
            onClick={() => setShowNotifications(true)}>
            <IoMdNotificationsOutline />
        </div>
        {showNotifications &&
            <NotificationsPanel setShowNotifications={setShowNotifications}/>
        }
        </>
    )
}

export default NotificationButton