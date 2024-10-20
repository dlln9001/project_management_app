import TopBarTextOptions from "./TopBarTextOptions";
import TopBarAlign from "./TopBarAlign";
import { MdFormatListBulleted } from "react-icons/md";
import { FaListOl } from "react-icons/fa";
import { FaRegCheckSquare } from "react-icons/fa";


function EditorTopBar({ editor }) {

    if (!editor) {
        return null
    }

    return (
        <div className=' absolute px-5 py-3 left-0 border-b border-b-slate-300 w-full flex items-center gap-2'>
            
            <TopBarTextOptions editor={editor}/>

            <TopBarAlign editor={editor}/>

            <div className="border-l border-slate-300 h-7"></div>

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
    )
}

export default EditorTopBar