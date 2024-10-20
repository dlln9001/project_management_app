import { BubbleMenu } from "@tiptap/react"

function BubbleMenuComponent({ editor }) {
    if (!editor) {
        return null
    }

    return (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className='shadow-all-sides py-1 px-2 rounded-md bg-white'>
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
    )
}

export default BubbleMenuComponent