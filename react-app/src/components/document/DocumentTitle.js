import { useState, useEffect } from "react"


function DocumentTitle(props) {
    const [title, setTitle] = useState('')
    const [titleSelected, setTitleSelected] = useState(false)
    
    useEffect(() => {
        setTitle(props.documentInfo.title)
    }, [props.documentInfo])

    
    function changeTitle() {
        props.setSaving(true)
        fetch('http://127.0.0.1:8000/document/change-title/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            },
            body: JSON.stringify({
                title: title,
                document_id: props.documentId
            })
        })
        .then(res => res.json())
        .then(data => {
            props.setGetDocumentInfo(prev => !prev)
            props.setRenderSideBar(prev => !prev)
            setTimeout(() => {
                props.setSaving(false)
            }, 400)
        })
    }


    return (
        <div className='border border-transparent hover:border-slate-300 mb-2 p-1 has-[:focus]:border-sky-600 rounded-sm'>
            <input type="text" value={titleSelected ? title : props.documentInfo.title} className=' text-4xl font-semibold focus:outline-none text-ellipsis w-full' 
            onFocus={() => {
                setTitle(props.documentInfo.title)
                setTitleSelected(true)
            }}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.target.blur()
                }
            }}
            onBlur={changeTitle}/>
        </div>
    )
}

export default DocumentTitle