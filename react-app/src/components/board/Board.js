import React, { useEffect, useState, useRef } from "react"
import { useLocation } from "react-router-dom"
import { AiOutlinePlus } from "react-icons/ai";


function Board() {
    const userToken = JSON.parse(localStorage.getItem('userToken'))
    const query = new URLSearchParams(useLocation().search)

    const [boardTitle, setBoardTitle] = useState('')
    const boardId = query.get('id')
    const [groupHtml, setGroupHtml] = useState('')
    // render groups does not send a request, render component does
    const [renderComponent, setRenderComponent] = useState(false)
    const [renderGroups, setRenderGroups] = useState(false)

    const [addItemContent, setAddItemContent] = useState('')
    const [focusedAddItem, setFocusedAddItem] = useState('')
    const [groupsData, setGroupsData] = useState('')

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
        .then(data => {
            setGroupsData(data)
            setRenderGroups(!renderGroups)
            console.log(data)
        })
    }, [boardId, renderComponent])

    // renders all the groups in a separate use effect than the fetch
    useEffect(() => {
        if (groupsData) {
            let tempGroupHtml = []
            let itemsHtml = []
            let itemHtml = []
            for (let i=0; i<groupsData.itemsInfo.length; i++) {
                for (let j=0; j<groupsData.itemsInfo[i].length; j++) {
                    itemHtml.push(
                        <div key={j} className="border-t border-t-slate-300 border-r border-r-slate-300 w-1/5 text-sm text-slate-600 p-1 px-5">
                            {groupsData.itemsInfo[i][j].name}
                        </div>
                    )
                }
                itemsHtml.push(
                    <div key={i}>
                        {itemHtml}
                    </div>
                )
                itemHtml = []
            }
            for (let i=0; i<groupsData.groupsInfo.length; i++) {
                let currentGroup = groupsData.groupsInfo[i]  
                let groupId = currentGroup.id
                tempGroupHtml.push(
                    <div key={i} className="mt-5">
                        <p>{currentGroup.name}</p>
                        <div className="border border-slate-300 rounded-md border-r-0 rounded-r-none">
                            <div className="w-1/5 border-r border-r-slate-300 flex flex-col">
                                <p className=" self-center p-1 text-sm text-slate-600">Item</p>
                            </div>

                                {itemsHtml[i]}

                            <div className={`border-t border-t-slate-300 p-1 px-2`}>
                                <input type="text" placeholder="+ Add item"   
                                className="w-1/5 border border-white text-sm pl-5 focus:outline-none hover:border-slate-200 hover:border rounded-sm
                                focus:border-sky-600 text-slate-600"
                                onFocus={() => addItemFocus(i)}
                                value={focusedAddItem === i ? addItemContent : ''}
                                onChange={(e) => changeFocusedAddItem(e.target.value)}
                                onBlur={() => createItem(groupId, addItemContent)}
                                /> 
                            </div>
                        </div>
                    </div>
                )
            }
            setGroupHtml(tempGroupHtml)
        }
    }, [renderGroups])

    function changeFocusedAddItem(value) {
        setAddItemContent(value)
        setRenderGroups(!renderGroups)
    }

    function addItemFocus(i) {
        setFocusedAddItem(i)
        setRenderGroups(!renderGroups)
    }

    function createItem(groupId, addItemContent) {
        if (addItemContent) {
            fetch('http://127.0.0.1:8000/board/create-item/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userToken}`
                },
                body: JSON.stringify({
                    group_id: groupId,
                    name: addItemContent
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status != 'success') {
                    console.log(data)
                }
                setRenderComponent(!renderComponent)
            })
        }
        setAddItemContent('')
        setRenderGroups(!renderGroups)

    }

    function createItemButton() {
        let groupId = groupsData.groupsInfo[0].id
        createItem(groupId, 'New item')
    }

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
            setRenderComponent(!renderComponent)
        })
    }

    return (
        <div className="bg-white h-screen rounded-tl-lg pl-10 py-5 pr-1">
            <p className="text-2xl hover:bg-slate-100 w-fit p-1 py-0 rounded-md cursor-pointer">{boardTitle}</p>
            <button onClick={() => createItemButton()} className="bg-sky-700 p-[6px] px-4 rounded-sm text-white text-sm hover:bg-sky-800 mt-5">New item</button>
            {groupHtml &&
                    groupHtml
            }
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