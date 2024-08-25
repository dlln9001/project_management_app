import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { AiOutlinePlus } from "react-icons/ai";


function Board() {
    const userToken = JSON.parse(localStorage.getItem('userToken'))
    const query = new URLSearchParams(useLocation().search)
    const [boardTitle, setBoardTitle] = useState('')
    const boardId = query.get('id')

    useEffect(() => {
        fetch('http://127.0.0.1:8000/board/get/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`,
            },
            body: JSON.stringify({
                board_id: boardId
            })
        })
        .then(res => res.json())
        .then(data => {
            setBoardTitle(data.boardInfo.name)
        })
        fetch('http://127.0.0.1:8000/board/get-groups/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                board_id: boardId
            })
        })
        .then(res => res.json())
        .then(data => console.log(data, 'get groups'))
    }, [boardId])

    function createGroup() {
        fetch('http://127.0.0.1:8000/board/create-group/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`,
            },
            body: JSON.stringify({
                board_id: boardId,
            })
        })
        .then(res => res.json())
        .then(data => {
            if (!data.status === 'success') {
                console.log(data)
            }
        })
    }

    return (
        <div className="bg-white h-screen rounded-tl-lg px-10 py-5">
            <p className="text-2xl hover:bg-slate-100 w-fit p-1 py-0 rounded-md cursor-pointer">{boardTitle}</p>
            <button className="flex gap-2 items-center border p-1 rounded-md px-2 border-slate-300 hover:bg-slate-100 mt-14" onClick={createGroup}>
                <div> 
                    <AiOutlinePlus />
                </div>
                <p className="text-sm text-slate-600">Add new group</p>
            </button>
        </div>
    )
}

export default Board