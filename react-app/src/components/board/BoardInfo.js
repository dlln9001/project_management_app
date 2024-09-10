import React, { useState, useEffect } from "react"

const BoardInfo = React.forwardRef((props, ref) => {
    const [boardOwnerInfo, setBoardOwnerInfo] = useState('')
    const [createdDate, setCreatedDate] = useState('')
    const userToken = JSON.parse(localStorage.getItem('userToken'))
    console.log(props.boardInfo)

    useEffect(() => {
        getOwnerInfo()

        // convert date format to be readable 
        const date = new Date(props.boardInfo.created_at)
        const options = {year: 'numeric', month: 'long', day: 'numeric'}
        const formattedDate = date.toLocaleDateString('en-US', options)
        setCreatedDate(formattedDate)

    }, [])

    function getOwnerInfo() {
        fetch('http://127.0.0.1:8000/authorize/get-user-info/', {
            method: 'POST',
            headers: {  
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                user_id: props.boardInfo.user
            })
        })
        .then(res => res.json())
        .then(data => setBoardOwnerInfo(data.user_info))
    }

    return (
        <div className="shadow-all-sides p-5 py-4 w-[422px] flex flex-col gap-3 rounded-md mt-2 absolute bg-white" ref={ref}>
            <div className="flex flex-col gap-2">
                <input type="text" className="font-medium text-lg w-full focus:outline-none border border-white hover:border-slate-300 px-1 rounded-sm focus:border-sky-600" 
                        value={props.boardTitle} />
                <textarea className="w-full h-8 focus:outline-none border border-white hover:border-slate-300 p-1 rounded-sm focus:border-sky-600 text-slate-500 text-sm 
                         focus:h-32"
                type="text" value={"Add your board's description here"} style={{resize: 'none'}} />
            </div>
            <hr className=" border-slate-300" />
            <p className=" font-medium">Board info</p>
            <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center">
                    <p className="text-slate-500 min-w-[33%]">Owner</p>
                    <div  className=" hover:bg-slate-100 w-full p-2 rounded-md">
                        <p>{boardOwnerInfo.name}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <p className="text-slate-500 min-w-[33%]">Created on</p>
                    <div  className=" hover:bg-slate-100 w-full p-2 rounded-md">
                        <p>{createdDate}</p>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default BoardInfo