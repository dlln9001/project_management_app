import React from 'react'
import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import './editor-styles.css';
import { useLocation } from "react-router-dom";
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'
import BubbleMenuComponent from './BubbleMenuComponent';
import FloatingMenuComponent from './FloatingMenuComponent';
import EditorTopBar from './EditorTopBar';

const extensions = 
    [StarterKit.configure({
        bulletList: true,
    }), 
    Underline,
    TextAlign.configure({
        types: ['heading', 'paragraph', 'listItem']
    }),
    TaskList,
    TaskItem,
    Placeholder.configure({
        placeholder: 'Write something'
    })]

let content = ''

function Document() {
    const { renderSideBar, setRenderSideBar } = useOutletContext()
    const query = new URLSearchParams(useLocation().search)
    const userToken = JSON.parse(localStorage.getItem('userToken'))

    const documentId = query.get('id')
    const [title, setTitle] = useState('')
    const [titleSelected, setTitleSelected] = useState(false)
    const [documentInfo, setDocumentInfo] = useState('')

    const [getDocumentInfo, setGetDocumentInfo] = useState(false)
    const [lastSaved, setLastSaved] = useState(Date.now())
    const [lastSavedDate, setLastSavedDate] = useState(new Date())

    const editor = useEditor({
        extensions: extensions,
        content: content,
    })

      // Debounced save on change
    useEffect(() => {
        const saveTimer = setTimeout(() => {
            saveDocument()
        }, 500);

        return () => clearTimeout(saveTimer);
    }, [editor.getHTML()]);

    // Periodic backup save
    useEffect(() => {
        const backupTimer = setInterval(() => {
        if (Date.now() - lastSaved > 120000) { // 2 minutes
            saveDocument()
        }
        }, 120000);

        return () => clearInterval(backupTimer);
    }, [lastSaved]);


    useEffect(() => {
        fetch('http://127.0.0.1:8000/document/get-document/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                document_id: documentId
            })
        })
        .then(res => res.json())
        .then(data => {
            setDocumentInfo(data.documentInfo)
            if (editor) {
                editor.commands.setContent(data.documentInfo.content) // Update editor content once fetched
            }
            console.log(data)
        })
    }, [getDocumentInfo, documentId])

    if (!editor) {
        return null
    }

    function changeTitle() {
        fetch('http://127.0.0.1:8000/document/change-title/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                title: title,
                document_id: documentId
            })
        })
        .then(res => res.json())
        .then(data => {
            setGetDocumentInfo(prev => !prev)
            setRenderSideBar(prev => !prev)
        })
    }

    function saveDocument() {
        fetch('http://127.0.0.1:8000/document/save-document/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            },
            body: JSON.stringify({
                document_content: editor.getHTML(),
                document_id: documentId
            })
        })
        .then(res => res.json())
        .then(data => {
            setLastSaved(Date.now())
            setLastSavedDate(new Date())
        })
    }

    return (
        <>
        {documentInfo && 
            <div className="bg-white h-full rounded-md flex justify-center relative">
    
                <EditorTopBar editor={editor}/>

                <div className='mt-28 w-[750px]'>
    
                    <div className='border border-transparent hover:border-slate-300 mb-8 p-1 has-[:focus]:border-sky-600 rounded-sm'>
                        <input type="text" value={titleSelected ? title : documentInfo.title} className=' text-4xl font-semibold focus:outline-none' 
                        onFocus={() => {
                            setTitle(documentInfo.title)
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

                    {/* <button onClick={saveDocument}>{lastSavedDate.toISOString()}</button> */}

    
                    <div className='z-10 prose'>
                        <EditorContent editor={editor} className='prose'/>
        
                        <FloatingMenuComponent editor={editor}/>
    
                        <BubbleMenuComponent editor={editor}/>
    
                    </div>
                </div>
            </div>
        }
        </>
    )
}

export default Document