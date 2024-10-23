import { useCallback } from "react";
import TopBarTextOptions from "./TopBarTextOptions";
import TopBarAlign from "./TopBarAlign";
import { MdFormatListBulleted } from "react-icons/md";
import { FaListOl } from "react-icons/fa";
import { FaRegCheckSquare } from "react-icons/fa";
import { MdOutlineImage } from "react-icons/md";


function EditorTopBar({ editor, userToken, documentId }) {

      function addImage(e) {
            const newImage = new FormData()
            newImage.append('new_image', e.target.files[0])
            newImage.append('document_id', documentId)

            fetch('http://127.0.0.1:8000/document/add-image/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${userToken}`
                },
                body: newImage
            })
            .then(res => res.json())
            .then(data => {
                const imageUrl = 'http://127.0.0.1:8000' + data.image_url
                if (editor && imageUrl) {
                    console.log(imageUrl)
                      editor.chain().focus().setImage({ src: imageUrl }).run()    
                }
            })


      }

    if (!editor) {
        return null
    }

    return (
        <div className=' absolute px-5 py-3 left-0 border-b border-b-slate-300 w-full flex items-center gap-2 bg-white z-10 rounded-tl-md'>
            
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
            <form action="" className="cursor-pointer">
                <label htmlFor="insert-picture" className={`rounded w-8 h-8 hover:bg-slate-100 font-medium flex justify-center items-center text-lg bg-white cursor-pointer`}> 
                            <MdOutlineImage />
                </label>
                <input type="file" id="insert-picture" accept='image/*' className='hidden' onChange={addImage}/>
            </form>

        </div>
    )
}

export default EditorTopBar