import ReactDom from 'react-dom'
import { IoIosClose } from "react-icons/io";
import { useEffect, useRef, useState } from 'react';
import { useBoardValues } from '../../../contexts/BoardValuesContext';
import { editItem } from './Items';


function ItemUpdates(props) {
    const itemUpdateRef = useRef('')
    const boardValues = useBoardValues()
    const [addingUpdate, setAddingUpdate] = useState(false)

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    })

    function handleDocumentClick(e) {
        if (itemUpdateRef && props.itemUpdateButtonRef && !itemUpdateRef.current.contains(e.target) && !props.itemUpdateButtonRef.current.contains(e.target)) {
            props.setShowItemUpdates(false)
        }
    }

    return ReactDom.createPortal(
        <div ref={itemUpdateRef} style={{top: 48, right:0}} className='fixed z-40 bg-white w-[40%] h-full shadow-all-sides'>
            <div className='mx-3 my-5'>
                
                <div className='text-4xl text-slate-500 cursor-pointer hover:bg-slate-100 rounded-md w-fit mb-1' onClick={() => props.setShowItemUpdates(false)}>
                    <IoIosClose />
                </div>
                
                <div className='border border-transparent hover:border-slate-300 rounded-sm px-1 has-[:focus]:border-sky-600'>
                    <input type="text" className='font-medium text-3xl focus:outline-none w-full truncate' 
                        value={props.itemUpdateName}
                        onChange={(e) => props.setItemUpdateName(e.target.value)}
                        onBlur={(e) => editItem(e.target.value, props.itemUpdateId, props.userToken, boardValues.setRenderComponent)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.target.blur()
                            }
                        }}/>
                </div>
            </div>

            <div className='border-b w-full border-slate-300'></div>

            <div className='mx-3'>
                <input type="text" placeholder='Write an update...' 
                    className='border border-sky-600 rounded-md px-3 py-2 focus:outline-none hover:bg-slate-100 w-full mt-10 text-lg' 
                    onFocus={() => setAddingUpdate(true)}/>
                {addingUpdate &&
                    <button className=' bg-sky-600 hover:bg-sky-700 text-white px-2 py-1 rounded-md mt-2 ml-auto'>Update</button>
                }
            </div>
        </div>,
        document.getElementById('board-id')
    )
}

export default ItemUpdates