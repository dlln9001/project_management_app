import { useState, useRef, useEffect } from "react";
import { FloatingMenu } from "@tiptap/react"
import { RiText } from "react-icons/ri";
import { LuHeading1 } from "react-icons/lu";
import { LuHeading2 } from "react-icons/lu";
import { LuHeading3 } from "react-icons/lu";


function FloatingMenuComponent({ editor }) {
    const [showFloatingMenuOptions, setShowFloatingMenuOptions] = useState(false)
    const floatingMenuRef = useRef('')

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }

    }, [])

    function handleDocumentClick(e) {
        if (floatingMenuRef.current && !floatingMenuRef.current.contains(e.target)) {
            setShowFloatingMenuOptions(false)
        }
    }

    if (!editor) {
        return null
    }
    return (
        <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div ref={floatingMenuRef} className="-translate-x-11">
                
                <button onClick={() => setShowFloatingMenuOptions(true)} className={` bg-sky-600 rounded w-6 h-6 text-white flex items-center justify-center`}>
                +
                </button>
                
                {showFloatingMenuOptions &&
                    <div className='shadow-all-sides px-2 py-2 bg-white rounded-md' onClick={() => setShowFloatingMenuOptions(false)}>
                        <div className=' hover:bg-slate-100 rounded-md flex gap-2 px-2 items-center py-1 cursor-pointer'
                            onClick={() => editor.chain().focus().setParagraph().run()}>
                            <RiText className=' text-lg'/>
                            <p className=' text-sm m-0'>Normal text</p>
                        </div>
                        <div className=' hover:bg-slate-100 rounded-md flex gap-2 px-2 items-center py-1 cursor-pointer' 
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                            <LuHeading1 className=' text-xl'/>
                            <p className=' text-sm m-0'>Large title</p>
                        </div>
                        <div className=' hover:bg-slate-100 rounded-md flex gap-2 px-2 items-center py-1 cursor-pointer' 
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                            <LuHeading2 className=' text-xl'/>
                            <p className=' text-sm m-0'>Medium title</p>
                        </div>
                        <div className=' hover:bg-slate-100 rounded-md flex gap-2 px-2 items-center py-1 cursor-pointer' 
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                            <LuHeading3 className=' text-xl'/>
                            <p className=' text-sm m-0'>Small title</p>
                        </div>
                    </div>
                }
            </div>
        </FloatingMenu>
    )
}

export default FloatingMenuComponent