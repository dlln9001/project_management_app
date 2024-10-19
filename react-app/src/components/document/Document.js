import React from 'react'
import './editor-styles.css';
import { useState, useRef, useEffect } from 'react'
import { useEditor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TaskList from '@tiptap/extension-task-list'
import { MdFormatListBulleted } from "react-icons/md";
import { FaListOl } from "react-icons/fa";
import { FaAlignLeft } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaAlignCenter } from "react-icons/fa";
import { FaAlignRight } from "react-icons/fa";
import { FaAlignJustify } from "react-icons/fa";
import { FaRegCheckSquare } from "react-icons/fa";
import TaskItem from '@tiptap/extension-task-item'


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
    const [showAlignments, setShowAlignments] = useState(false)
    const alignmentButtonRef = useRef('')

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }

    }, [])

    function handleDocumentClick(e) {
        if (alignmentButtonRef.current && !alignmentButtonRef.current.contains(e.target)) {
            setShowAlignments(false)
        }
    }

    const editor = useEditor({
        extensions: extensions,
        content: content,
    })

    if (!editor) {
        return null
    }

    return (
        <div className="bg-white h-full rounded-md flex justify-center relative">
            <div className=' absolute px-5 py-3 left-0 border-b border-b-slate-300 w-full flex'>
                <div className='relative' ref={alignmentButtonRef}>
                    <button onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setShowAlignments(true)
                        }} 
                            className={`rounded w-10 h-8  font-medium flex justify-center items-center text-md
                                     ${showAlignments ? ' bg-slate-100' : 'bg-white hover:bg-slate-100'}`}>
                        {editor.isActive({ textAlign: 'left' }) &&
                            <FaAlignLeft />
                        }
                        {editor.isActive({ textAlign: 'center' }) &&
                            <FaAlignCenter />
                        }
                        {editor.isActive({ textAlign: 'right' }) &&
                            <FaAlignRight />
                        }
                        {editor.isActive({ textAlign: 'justify' }) &&
                            <FaAlignJustify />
                        }
                        <IoMdArrowDropdown />
                    </button>
                    {showAlignments &&
                        <div className='flex gap-1 absolute bg-white shadow-all-sides p-2 rounded-md' onClick={() => setShowAlignments(false)}>
                            <button
                                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                                className={`p-1  rounded-sm cursor-pointer ${editor.isActive({ textAlign: 'left' }) ? 'bg-sky-100' : 'hover:bg-slate-100'}`}>
                                <FaAlignLeft />  
                            </button>
                            <button
                                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                                className={`p-1  rounded-sm cursor-pointer ${editor.isActive({ textAlign: 'center' }) ? 'bg-sky-100' : 'hover:bg-slate-100'}`}>
                                <FaAlignCenter />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                                className={`p-1  rounded-sm cursor-pointer ${editor.isActive({ textAlign: 'right' }) ? 'bg-sky-100' : 'hover:bg-slate-100'}`}>
                                <FaAlignRight />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                                className={`p-1 rounded-sm cursor-pointer ${editor.isActive({ textAlign: 'justify' }) ? 'bg-sky-100' : 'hover:bg-slate-100'}`}>
                                <FaAlignJustify />
                            </button>
                        </div>
                    }
                </div>
                <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`rounded w-8 h-8 hover:bg-slate-100 font-medium flex justify-center items-center text-lg
                                bg-white`}>
                    <MdFormatListBulleted />
                </button>
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`rounded w-8 h-8 hover:bg-slate-100 font-medium flex justify-center items-center text-md
                                bg-white`}>
                    <FaListOl />
                </button>
                <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={`rounded w-8 h-8 hover:bg-slate-100 font-medium flex justify-center items-center text-md
                                bg-white`}>
                    <FaRegCheckSquare />
                </button>
            </div>
            <div className='mt-28 w-[750px]'>
                <div className='border border-transparent hover:border-slate-300 mb-8 p-1 has-[:focus]:border-sky-600 rounded-sm'>
                    <input type="text" value={'Title'} className=' text-4xl font-semibold focus:outline-none' />
                </div>
                <div className='z-10 prose'>
                    {/* <style>{editorStyles}</style> */}
                    <EditorContent editor={editor} className='prose'/>
                    <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={` bg-sky-600 rounded w-6 h-6 text-white flex items-center justify-center`}>
                        +
                        </button>
                    </FloatingMenu>
                    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                        <div className='shadow-all-sides p-1 rounded-md bg-white'>
                            <button onClick={() => editor.chain().focus().toggleBold().run()} className={`rounded w-7 h-7 hover:bg-slate-100 font-medium
                                ${editor.isActive('bold') ? 'text-sky-600 bg-sky-200' : 'bg-white'}`}>
                            B
                            </button>
                            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`rounded w-7 h-7 hover:bg-slate-100 font-medium
                                ${editor.isActive('italic') ? 'text-sky-600 bg-sky-200' : 'bg-white'}`}>
                            <i>i</i>
                            </button>
                            <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`rounded w-7 h-7 hover:bg-slate-100 font-medium
                                ${editor.isActive('underline') ? 'text-sky-600 bg-sky-200' : 'bg-white'}`}>
                            <u>U</u>
                            </button>
                            <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`rounded w-7 h-7 hover:bg-slate-100 font-medium
                                ${editor.isActive('strike') ? 'text-sky-600 bg-sky-200' : 'bg-white'}`}>
                            <s> S </s>
                            </button>
                        </div>
                    </BubbleMenu>
                </div>
            </div>
        </div>
    )
}

export default Document