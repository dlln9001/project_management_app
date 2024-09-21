import { useState, useEffect } from "react"
import { useBoardValues } from "../../../contexts/BoardValuesContext"

function GroupColors(props) {
    const boardValues = useBoardValues()

    const [showColorOptions, setShowColorOptions] = useState(false)
    const [colorOptionsHtml, setColorOptionsHtml] = useState('')
    const colorOptions = ['bg-emerald-600', 'bg-green-500', 'bg-lime-500', 'bg-yellow-500', 'bg-amber-400', 'bg-violet-600', 'bg-purple-500', 'bg-blue-500', 'bg-sky-400', 
                         'bg-cyan-300', 'bg-rose-700', 'bg-red-500', 'bg-pink-600', 'bg-pink-300', 'bg-orange-600', 'bg-amber-500', 'bg-yellow-800', 'bg-gray-300', 
                         'bg-gray-500', 'bg-slate-600']

    function createColorOptionsHtml() {
        let tempColorOptionsHtml = []
        for (let i=0; i<colorOptions.length; i++) {
            tempColorOptionsHtml.push(
                <div className="p-1 hover:bg-slate-100 rounded-md cursor-pointer" key={i} 
                    onMouseDown={() => {
                        setShowColorOptions(false)
                        editGroupColor(colorOptions[i])
                    }}>
                    <div className={`w-[22px] h-[22px] ${colorOptions[i]} rounded-[4px]`}></div>
                </div>
            )
        }
        setColorOptionsHtml(tempColorOptionsHtml)
    }

    function editGroupColor(groupColor) {
        fetch('http://127.0.0.1:8000/board/edit-group-color/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            },
            body: JSON.stringify({
                group_id: props.groupId,
                group_color: groupColor
            })
        })
        .then(res => res.json())
        .then(data => boardValues.setRenderComponent(!boardValues.renderComponent))
    }

    return (
        <>
            <div className={`absolute w-[15px] h-[15px] rounded-[4px] left-2 cursor-pointer ${props.currentGroup.color} hover:opacity-80`} onMouseDown={(e) => {
                    e.preventDefault()
                    setShowColorOptions(true)
                    createColorOptionsHtml(props.groupId)
                }}>
                </div>
            {showColorOptions &&
                    <div className="absolute top-9 bg-white border border-slate-300 rounded-[5px] flex p-1 gap-[1px] flex-wrap w-[164px] z-10"
                        onMouseDown={(e) => e.preventDefault()}>
                        {colorOptionsHtml}
                    </div>
            }
       </>
    )
}

export default GroupColors