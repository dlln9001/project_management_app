import React from 'react'
import './editor-styles.css';
import { useState, useRef, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
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
    TaskItem]

const content = '<p>Hello World!</p>'

function Document() {
    const editor = useEditor({
        extensions: extensions,
        content: content,
    })

    if (!editor) {
        return null
    }

    return (
        <div className="bg-white h-full rounded-md flex justify-center relative">
            
            <EditorTopBar editor={editor}/>

            <div className='mt-28 w-[750px]'>
                <div className='border border-transparent hover:border-slate-300 mb-8 p-1 has-[:focus]:border-sky-600 rounded-sm'>
                    <input type="text" value={'Title'} className=' text-4xl font-semibold focus:outline-none' />
                </div>
                <div className='z-10 prose'>
                    <EditorContent editor={editor} className='prose'/>
    
                    <FloatingMenuComponent editor={editor}/>

                    <BubbleMenuComponent editor={editor}/>

                </div>
            </div>
        </div>
    )
}

export default Document