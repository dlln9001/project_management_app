import reactDom from "react-dom"
import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";


function NotificationsPanel(props) {
    const [notificationsInfo, setNotificationsInfo] = useState('')

    useEffect(() => {
        getAllNotifications()
    }, [])

    console.log(notificationsInfo)

    function getAllNotifications() {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/notifications/get-all-notifications/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            }
        })
        .then(res => res.json())
        .then(data => setNotificationsInfo(data.notifications))
    }

    return reactDom.createPortal(
        <div className="absolute right-0 top-[48px] shadow-all-sides bg-white w-1/3 h-[calc(100%-48px)] z-40 p-4">
            <div className="flex">
                <p className="text-2xl">Notifications</p>
                <div className="ml-auto rounded-md p-1 hover:bg-slate-100 text-2xl cursor-pointer" onClick={() => props.setShowNotifications(false)}>
                    <IoIosClose />
                </div>
            </div>
            <div className="border border-b border-slate-300 my-7"></div>
            <div>
                {notificationsInfo &&
                    notificationsInfo.map((notification, index) => {
                        const notificationDate = new Date(notification.created_at)
                        const currentDate = new Date()
                        const diffInMs = currentDate - notificationDate

                        // Convert the difference into seconds, minutes, hours, etc.
                        const diffInSec = Math.floor(diffInMs / 1000);
                        const diffInMin = Math.floor(diffInSec / 60);
                        const diffInHours = Math.floor(diffInMin / 60);
                        const diffInDays = Math.floor(diffInHours / 24);

                        // Format the output based on the difference
                        let timeAgo = '';

                        if (diffInDays > 0) {
                            timeAgo = `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
                        } else if (diffInHours > 0) {
                            timeAgo = `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
                        } else if (diffInMin > 0) {
                            timeAgo = `${diffInMin} minute${diffInMin > 1 ? 's' : ''} ago`;
                        } else if (diffInSec > 0) {
                            timeAgo = `${diffInSec} second${diffInSec > 1 ? 's' : ''} ago`;
                        } else {
                            timeAgo = 'just now';
                        }

                        return (
                            <div className=" mb-4 border rounded-md p-2" key={index}>
                                <div className="flex mb-1">
                                    <h2 className=" font-medium text-sm">{notification.type}</h2>
                                    <p className="ml-auto text-xs text-slate-400">{timeAgo}</p>
                                </div>
                                <div className="flex items-center">
                                    <p className=" text-sm text-slate-800 truncate">{notification.message}</p>
                                    {notification.is_read
                                    ? <p className="px-2 rounded-md border border-green-600 text-green-600 text-xs ml-auto">read</p>
                                    : 
                                    <div className="ml-auto flex gap-2">
                                        <p className="px-2 rounded-md border border-red-600 text-red-600 text-xs">not read</p>
                                    </div>
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>,
        document.getElementById('portal-root')
    )
}

export default NotificationsPanel