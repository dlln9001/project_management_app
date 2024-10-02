import { useState, useEffect, useRef } from "react"
import { DayPicker, getDefaultClassNames  } from "react-day-picker";
import { useBoardValues } from "../../../contexts/BoardValuesContext";
import "react-day-picker/style.css";

function DateColumn(props) {
    const boardValues = useBoardValues()
    const [openDatePicker, setOpenDatePicker] = useState(false)
    const [selectedDate, setSelectedDate] = useState('')
    const datePickerRef = useRef('')
    const columnValueId = props.columnValues[props.k].id
    const today = new Date();
    const hundredYearsAgo = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    const hundredYearsInFuture = new Date(today.getFullYear() + 100, today.getMonth(), today.getDate());

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick)
        if (props.columnValues[props.k].value_date) {
            const formattedDate = new Date(props.columnValues[props.k].value_date)
            setSelectedDate(formattedDate)
        }
    }, [])

    function handleDocumentClick(e) {
        if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
            setOpenDatePicker(false)
        }
    }

    function editDateColumn(selectedDate) {
        fetch('http://127.0.0.1:8000/board/edit-date-column/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`,
            },
            body: JSON.stringify({
                column_value_id: columnValueId,
                selected_date: selectedDate
            })
        })
        .then(res => res.json())
        .then(data => boardValues.setRenderComponent(prev => !prev))
    }

    return (
        <div className="min-w-36 relative flex justify-center border-t border-t-slate-300 border-r border-r-slate-300 group" ref={datePickerRef}>
            <div className="border border-transparent hover:border-slate-400 w-[90%] relative self-center cursor-text peer min-h-[22px] bg-white text-center" 
                 onClick={() => setOpenDatePicker(true)}>
                {selectedDate && selectedDate.toLocaleDateString()}
            </div>
            {!selectedDate && 
                <img src={process.env.PUBLIC_URL + `images/columns/hovers/datehover.png`} alt="" onClick={() => setOpenDatePicker(true)}
                     className=" h-[40%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible cursor-text"/>
            }
            {openDatePicker && 
                <div className="absolute bg-white z-10 shadow-all-sides rounded-md p-3 top-7 min-w-64">
                    <DayPicker
                    mode="single"
                    captionLayout="dropdown"
                    showOutsideDays
                    startMonth={hundredYearsAgo} // Allows dates starting from 100 years ago
                    endMonth={hundredYearsInFuture} // Allows dates up to 100 years in the future              
                    selected={selectedDate}
                    onSelect={(date) => {
                        setSelectedDate(date)
                        editDateColumn(date)
                        setOpenDatePicker(false)
                    }}
                    classNames={{
                        root: 'scale-85', // Scale down the entire calendar
                        month_caption: 'mb-4', 
                        day: 'text-s w-8 h-8 cursor-pointer', // Smaller day size (width and height)
                        day_button: `w-full block h-full`,
                        head_cell: 'text-xs p-2', 
                        today: `text-sky-600 font-bold border rounded-md`,
                        selected: `bg-sky-600 text-white rounded-md border-white`,
                        weekday: `text-center`,
                        outside: `opacity-40`,
                        years_dropdown: `custom-scrollbar text-center`,
                        months_dropdown: `custom-scrollbar text-center`,
                        caption_label: `px-3 flex`,
                        chevron: `h-5 w-5 fill-sky-600`
                      }}/>
                </div>
            }
        </div>
    )
}

export default DateColumn