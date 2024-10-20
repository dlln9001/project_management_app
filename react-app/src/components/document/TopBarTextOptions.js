import { useState, useEffect, useRef } from "react";
import { RiText } from "react-icons/ri";
import { LuHeading1 } from "react-icons/lu";
import { LuHeading2 } from "react-icons/lu";
import { LuHeading3 } from "react-icons/lu";
import { IoMdArrowDropdown } from "react-icons/io";


function TopBarTextOptions({ editor }) {
    const [showTurnIntoTextOptions, setShowTurnIntoTextOptions] = useState(false)
    const turnIntoTextOptionsRef = useRef('')

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }

    }, [])

    
    function handleDocumentClick(e) {
        if (turnIntoTextOptionsRef.current && !turnIntoTextOptionsRef.current.contains(e.target)) {
            setShowTurnIntoTextOptions(false)
        }
    }


    if (!editor) {
        return null
    }

    return (
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
    )
}

export default TopBarTextOptions