import reactDom from "react-dom"
import { IoIosClose } from "react-icons/io";


function NotificationsPanel(props) {
    return reactDom.createPortal(
        <div className="absolute right-0 top-[48px] shadow-all-sides bg-white w-1/3 h-[calc(100%-48px)] z-40 p-4">
            <div className="flex">
                <p className="text-2xl">Notifications</p>
                <div className="ml-auto rounded-md p-1 hover:bg-slate-100 text-2xl cursor-pointer" onClick={() => props.setShowNotifications(false)}>
                    <IoIosClose />
                </div>
            </div>
            <div className="border border-b border-slate-300 my-7"></div>
        </div>,
        document.getElementById('portal-root')
    )
}

export default NotificationsPanel