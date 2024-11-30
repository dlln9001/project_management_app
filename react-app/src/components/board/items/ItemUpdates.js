import ReactDom from 'react-dom'
import { IoIosClose } from "react-icons/io";
import { useEffect, useRef, useState } from 'react';
import { useBoardValues } from '../../../contexts/BoardValuesContext';
import UpdateOptions from './UpdateOptions';
import { editItem } from './Items';
import { CiClock2 } from "react-icons/ci";
import { SlOptions } from "react-icons/sl";

function ItemUpdates(props) {
    const itemUpdateRef = useRef('')
    const updateOptionsRef = useRef('')
    const boardValues = useBoardValues()
    const [addingUpdate, setAddingUpdate] = useState(false)
    const [addUpdateContent, setAddUpdateContent] = useState('')
    const [itemUpdatesData, setItemUpdatesData] = useState([])
    const [updateOptionsIndex, setUpdateOptionsIndex] = useState('')
    const [updateData, setUpdateData] = useState(false)
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)
        getItemUpdate()

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    }, [])

    useEffect(() => {
        getItemUpdate()
    }, [updateData, props.itemUpdateId])

    function handleDocumentClick(e) {
        if (updateOptionsRef.current && !updateOptionsRef.current.contains(e.target)) {
            setUpdateOptionsIndex(false)
        }
    }

    function addItemUpdate() {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/board/add-item-update/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            },
            body: JSON.stringify({
                update_content: addUpdateContent,
                item_id: props.itemUpdateId
            })
        })
        .then(res => res.json())
        .then(data => {
            getItemUpdate()
            setAddUpdateContent('')
        })
    }

    function getItemUpdate() {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/board/get-item-update/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            },
            body: JSON.stringify({
                item_id: props.itemUpdateId
            })
        })
        .then(res => res.json())
        .then(data => {
            setItemUpdatesData(data.item_updates_data)
        })
    }

    return ReactDom.createPortal(
        <div ref={itemUpdateRef} style={{top: 48, right:0}} className='fixed z-40 bg-white w-[40%] h-full shadow-all-sides overflow-clip'>
            <div className='mx-6 my-5'>
                
                <div className='text-4xl text-slate-500 cursor-pointer hover:bg-slate-100 rounded-md w-fit mb-1' onClick={() => props.setShowItemUpdates(false)}>
                    <IoIosClose />
                </div>
                
                <div className='border border-transparent hover:border-slate-300 rounded-sm px-1 has-[:focus]:border-sky-600'>
                    <input type="text" 
                        className='font-medium text-3xl focus:outline-none w-full truncate' 
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

            <div className='mx-6'>
                <input type="text" placeholder='Write an update...' value={addUpdateContent}
                    className='border border-sky-600 rounded-md px-3 py-2 focus:outline-none hover:bg-slate-100 w-full mt-10 text-lg' 
                    onFocus={() => setAddingUpdate(true)}
                    onChange={(e) => setAddUpdateContent(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            addItemUpdate()
                        }
                    }}/>

                {addingUpdate &&
                    <button 
                        className=' bg-sky-600 hover:bg-sky-700 text-white px-2 py-1 rounded-md mt-2 ml-auto'
                        onClick={addItemUpdate}>
                        Update
                    </button>
                }
            </div>

            <div className='mt-7 h-[65%] overflow-auto custom-scrollbar'>
                {itemUpdatesData.map((item, i) => {
                    let date = new Date(item.created_at)
                    const options = { 
                        year: "numeric", 
                        month: "long", 
                        day: "numeric", 
                        hour: "2-digit", 
                        minute: "2-digit"
                      }
                    return (
                        <div key={i} className='border rounded-md border-slate-300 p-5 my-3 mx-6'>
                            <div className='flex'>               
                                <div className='flex items-center gap-2'>
                                    {item.author.is_default_profile_picture 
                                    ? 
                                    <div className='bg-slate-400 w-10 h-10 rounded-full flex text-white items-center justify-center font-medium text-lg'>
                                        {item.author.name[0].toUpperCase()}
                                    </div>
                                    :
                                    <img src={process.env.REACT_APP_MEDIA_BASE_URL + item.author.profile_picture} alt="" 
                                        className='w-10 h-10 rounded-full'/>
                                    }
                                    <p>{item.author.name}</p>
                                </div>
                                <div className='ml-auto flex gap-1 items-center'>
                                    <div>
                                        <CiClock2 />
                                    </div>
                                    <p className='text-sm'>{date.toLocaleString('en-US', options)}</p>
                                    {userInfo.id === item.author.id && 
                                        <div className='relative' ref={updateOptionsIndex === i ? updateOptionsRef : null}>
                                            <div className={`hover:bg-slate-100 rounded-md cursor-pointer text-xs p-1 ml-1 ${updateOptionsIndex === i && `bg-sky-100`}`}
                                                onClick={() => {
                                                    setUpdateOptionsIndex(i)
                                                }}>
                                                <SlOptions />
                                            </div>
                                            {updateOptionsIndex === i &&
                                                <UpdateOptions 
                                                    setUpdateOptionsIndex={setUpdateOptionsIndex} 
                                                    itemUpdateId={item.id} 
                                                    userToken={props.userToken}
                                                    setUpdateData={setUpdateData}/>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                            <p className='mt-6'>{item.content}</p>
                        </div>
                    )
                })
                }
            </div>
        </div>,
        document.getElementById('board-id')
    )
}

export default ItemUpdates