import React from 'react'
import { useState, useEffect, useCallback } from 'react';
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
import Image from '@tiptap/extension-image'
import BubbleMenuComponent from './BubbleMenuComponent';
import FloatingMenuComponent from './FloatingMenuComponent';
import EditorTopBar from './top-bar/EditorTopBar';
import DocumentTitle from './DocumentTitle';
import { IoMdCreate } from "react-icons/io";
import { FaArrowsRotate } from "react-icons/fa6";
import { FaRegCircleCheck } from "react-icons/fa6";


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
    }),
        Image]

let content = ''


function Document() {
    const { renderSideBar, setRenderSideBar } = useOutletContext()
    const query = new URLSearchParams(useLocation().search)
    const userToken = JSON.parse(localStorage.getItem('userToken'))

    const documentId = query.get('id')
    const [documentInfo, setDocumentInfo] = useState('')

    const [getDocumentInfo, setGetDocumentInfo] = useState(false)
    const [lastSaved, setLastSaved] = useState(Date.now())
    const [createdAt, setCreatedAt] = useState('')
    const [saving, setSaving] = useState(false)

    const editor = useEditor({
        extensions: extensions,
        content: content,
    })


    // Debounced save on change
    useEffect(() => {
        setSaving(true)
        const saveTimer = setTimeout(() => {
            saveDocument()
        }, 700);

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
        fetch(`${process.env.REACT_APP_API_BASE_URL}/document/get-document/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${ userToken }`
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
                let created_at_date = new Date(data.documentInfo.created_at)
                let extraZero = ''
                if (created_at_date.getMinutes() < 10) {
                    extraZero = '0'
                }
                let created_at_format = created_at_date.getMonth() + 1 + '/' + created_at_date.getDate() + '/' + created_at_date.getFullYear() + ', ' +
                    created_at_date.getHours() + ':' + extraZero + created_at_date.getMinutes()
                setCreatedAt(created_at_format)
                // console.log(data)
            })
    }, [getDocumentInfo, documentId])

    if (!editor) {
        return null
    }


    function saveDocument() {
        fetch(`${ process.env.REACT_APP_API_BASE_URL }/document/save-document/`, {
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
            setSaving(false)
        })
}


return (
    <>
        {documentInfo &&
            <div className="bg-white h-full rounded-tl-md flex justify-center relative">

                <EditorTopBar editor={editor} userToken={userToken} documentId={documentId} />

                <div className='overflow-auto w-full flex justify-center custom-scrollbar'>
                    <div className='mt-28 w-[750px]'>

                        <DocumentTitle
                            userToken={userToken}
                            documentInfo={documentInfo}
                            documentId={documentId}
                            setSaving={setSaving}
                            setGetDocumentInfo={setGetDocumentInfo}
                            setRenderSideBar={setRenderSideBar} />

                        <div className='mb-6 flex gap-5'>
                            <div className='text-sm flex gap-2 items-center'>
                                <IoMdCreate />
                                <div className='flex gap-1'>
                                    <p>Created</p>
                                    <strong>{createdAt && createdAt}</strong>
                                </div>
                            </div>
                            {saving
                                ?
                                <div className='flex gap-2 items-center'>
                                    <FaArrowsRotate />
                                    <p className='text-sm text-slate-700'>saving...</p>
                                </div>
                                :
                                <div className='flex gap-2 items-center'>
                                    <FaRegCircleCheck />
                                    <p className='text-sm text-slate-700'>saved</p>
                                </div>
                            }
                        </div>

                        <div className='z-10 prose'>
                            <EditorContent editor={editor} className='prose' />

                            <FloatingMenuComponent editor={editor} />

                            <BubbleMenuComponent editor={editor} />
                        </div>
                    </div>
                </div>
            </div>
        }
    </>
)
}

export default Document