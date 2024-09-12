import React, { useState, useEffect, useRef } from "react"

const BoardInfo = React.forwardRef((props, ref) => {
    const userToken = JSON.parse(localStorage.getItem('userToken'))
    const [boardOwnerInfo, setBoardOwnerInfo] = useState('')
    const [createdDate, setCreatedDate] = useState('')

    const [boardName, setBoardName] = useState('')
    const [boardDescription, setBoardDescription] = useState('')

    const [isDescriptionOverflowing, setIsDescriptionOverflowing] = useState('')
    const descriptionRef = useRef('')
    const [descriptionHeight, setDescriptionHeight] = useState('')
    const [updateEffect, setUpdateEffect] = useState(true)


    useEffect(() => {
        getOwnerInfo()
        setBoardDescription(props.boardInfo.description)

        // convert date format to be readable 
        const date = new Date(props.boardInfo.created_at)
        const options = {year: 'numeric', month: 'long', day: 'numeric'}
        const formattedDate = date.toLocaleDateString('en-US', options)
        setCreatedDate(formattedDate)
    }, [])

    useEffect(() => {
        // check if description is overflowing, set height
        const descriptionElement = descriptionRef.current
        const isOverflow = descriptionElement.scrollHeight > descriptionElement.clientHeight
        setIsDescriptionOverflowing(isOverflow)
        setDescriptionHeight(descriptionElement.scrollHeight)
    }, [boardDescription, updateEffect])

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

    function changeBoardName(boardName) {
        fetch('http://127.0.0.1:8000/board/change-board-name/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                board_id: props.boardInfo.id,
                board_name: boardName
            })
        })
        .then(res => res.json())
        .then(data => {
            props.setRenderComponent(!props.renderComponent)
            props.setRenderSideBar(!props.renderSideBar)
        })
    }

    function changeBoardDescription(boardDescription) {
        fetch('http://127.0.0.1:8000/board/change-board-description/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                board_id: props.boardInfo.id,
                board_description: boardDescription
            })
        })
        .then(res => res.json())
        .then(data => {
            props.setRenderComponent(!props.renderComponent)
        })
    }


    return (
        <div className="shadow-all-sides p-5 py-4 w-[422px] flex flex-col gap-3 rounded-md mt-2 absolute bg-white" ref={ref}>
            <div className="flex flex-col gap-2">
                <input type="text" className="font-medium text-lg w-full focus:outline-none border border-white hover:border-slate-300 px-1 rounded-sm focus:border-sky-600" 
                        value={boardName ? boardName : props.boardTitle} 
                        onFocus={(e) => {
                            setBoardName(e.target.value)
                        }}
                        onChange={(e) => {
                            setBoardName(e.target.value)
                        }}
                        onBlur={(e) => changeBoardName(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter') {
                                changeBoardName(e.target.value)
                            }
                        }}/>
                <textarea type="text" className="w-full max-h-32 h-9 focus:outline-none border border-white hover:border-slate-300 p-1 rounded-sm focus:border-sky-600 text-slate-500 text-sm 
                         focus:min-h-32"  value={boardDescription} ref={descriptionRef} style={{resize: 'none', height: descriptionHeight}} 
                         onFocus={(e) => setBoardDescription(e.target.value)}
                         onChange={(e) => setBoardDescription(e.target.value)}
                         onBlur={(e) => {
                            changeBoardDescription(e.target.value)
                            setDescriptionHeight(36)
                            setUpdateEffect(!updateEffect)
                        }}/>
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