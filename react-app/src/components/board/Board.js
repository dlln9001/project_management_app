import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

function Board() {
    const userToken = JSON.parse(localStorage.getItem('userToken'))
    const query = new URLSearchParams(useLocation().search)
    const [boardTitle, setBoardTitle] = useState('')

    useEffect(() => {
        fetch('http://127.0.0.1:8000/board/get/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`,
            },
            body: JSON.stringify({
                id: query.get('id')
            })
        })
        .then(res => res.json())
        .then(data => {
            setBoardTitle(data.boardInfo.title)
        })
    }, [query])

    return (
        <div className="bg-white h-screen rounded-tl-lg p-5">
            <p className="text-2xl hover:bg-slate-100 w-fit p-1 py-0 rounded-md cursor-pointer">{boardTitle}</p>
        </div>
    )
}

export default Board