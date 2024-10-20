import React from 'react'
import './editor-styles.css';
import { useState, useRef, useEffect } from 'react'
import { useEditor, EditorContent, FloatingMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import BubbleMenuComponent from './BubbleMenuComponent';
import FloatingMenuComponent from './FloatingMenuComponent';
import { MdFormatListBulleted } from "react-icons/md";
import { FaListOl } from "react-icons/fa";
import { FaAlignLeft } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaAlignCenter } from "react-icons/fa";
import { FaAlignRight } from "react-icons/fa";
import { FaAlignJustify } from "react-icons/fa";
import { FaRegCheckSquare } from "react-icons/fa";
import { RiText } from "react-icons/ri";
import { LuHeading1 } from "react-icons/lu";
import { LuHeading2 } from "react-icons/lu";
import { LuHeading3 } from "react-icons/lu";

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
    const [showTurnIntoTextOptions, setShowTurnIntoTextOptions] = useState(false)
    const turnIntoTextOptionsRef = useRef('')
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
        if (turnIntoTextOptionsRef.current && !turnIntoTextOptionsRef.current.contains(e.target)) {
            setShowTurnIntoTextOptions(false)
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
            <div className=' absolute px-5 py-3 left-0 border-b border-b-slate-300 w-full flex items-center gap-2'>
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
                <div className='relative' ref={turnIntoTextOptionsRef}>
                    <button onMouseDown={() => setShowTurnIntoTextOptions(true)} 
                            className='flex gap-2 hover:bg-slate-100 items-center h-8 px-2 rounded-md'>
                        {editor.isActive('paragraph') &&
                            <div className='flex gap-2'>
                                <RiText className=' text-lg'/>
                                <p className=' text-sm m-0'>Normal text</p>
                            </div>
                        }
                        {editor.isActive('heading', { level: 1 }) &&
                            <div className='flex gap-2'>
                                <LuHeading1 className=' text-xl'/>
                                <p className=' text-sm m-0'>Large title</p>
                            </div>
                        }
                        {editor.isActive('heading', { level: 2 }) &&
                            <div className='flex gap-2'>
                                <LuHeading2 className=' text-xl'/>
                                <p className=' text-sm m-0'>Medium title</p>
                            </div>
                        }
                        {editor.isActive('heading', { level: 3 }) &&
                            <div className='flex gap-2'>
                                <LuHeading3 className=' text-xl'/>
                                <p className=' text-sm m-0'>Small title</p>
                            </div>
                        }
                        <IoMdArrowDropdown />
                    </button>
                    {showTurnIntoTextOptions &&
                        <div className='absolute shadow-all-sides bg-white px-2 py-1 rounded-md w-40' onClick={() => setShowTurnIntoTextOptions(false)}>
                            <div className={`rounded-md flex gap-2 px-3 items-center py-1 cursor-pointer 
                                    ${editor.isActive('paragraph') ? 'bg-sky-100' : 'hover:bg-slate-100 bg-white'}`}
                                onClick={() => editor.chain().focus().setParagraph().run()}>
                                <RiText className=' text-lg'/>
                                <p className=' text-sm m-0'>Normal text</p>
                            </div>
                            <div className={`rounded-md flex gap-2 px-3 items-center py-1 cursor-pointer
                                    ${editor.isActive('heading', { level: 1 }) ? 'bg-sky-100' : 'hover:bg-slate-100 bg-white'}`}
                                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                                <LuHeading1 className=' text-xl'/>
                                <p className=' text-sm m-0'>Large title</p>
                            </div>
                            <div className={`rounded-md flex gap-2 px-3 items-center py-1 cursor-pointer
                                 ${editor.isActive('heading', { level: 2 }) ? 'bg-sky-100' : 'hover:bg-slate-100 bg-white'}`}
                                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                                <LuHeading2 className=' text-xl'/>
                                <p className=' text-sm m-0'>Medium title</p>
                            </div>
                            <div className={`rounded-md flex gap-2 px-3 items-center py-1 cursor-pointer
                                 ${editor.isActive('heading', { level: 3 }) ? 'bg-sky-100' : 'hover:bg-slate-100 bg-white'}`}
                                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                                <LuHeading3 className=' text-xl'/>
                                <p className=' text-sm m-0'>Small title</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
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