import { useState, useEffect, useRef } from "react";
import { FaAlignLeft } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaAlignCenter } from "react-icons/fa";
import { FaAlignRight } from "react-icons/fa";
import { FaAlignJustify } from "react-icons/fa";

function TopBarAlign({ editor }) {

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

    if (!editor) {
        return null
    }

    return (
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
    )
}

export default TopBarAlign