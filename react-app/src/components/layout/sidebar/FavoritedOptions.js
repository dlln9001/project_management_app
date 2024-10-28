import { FaRegStar } from "react-icons/fa";

function FavoritedOptions(props) {


    function removeFavorite(e) {
        e.stopPropagation()
        fetch('http://127.0.0.1:8000/workspace-element/remove-favorite/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${props.userToken}`
            },
            body: JSON.stringify({
                favorite_id: props.itemData.favorite_model_id
            })
        })
        .then(res => res.json())
        .then(data => {
            props.setWorkspaceItemOptionsId('')
            props.setRenderSideBar(prev => !prev)
        })
    }


    return (
        <div className="absolute bg-white z-30 whitespace-nowrap rounded-sm p-1 shadow-all-sides w-64 ">
            <div className="flex gap-2 cursor-pointer hover:bg-slate-100 px-3 py-2 items-center rounded-md" onClick={removeFavorite}>
                <div className="text-lg">
                    <FaRegStar/>
                </div>
                <p>Remove from favorites</p>
            </div>
        </div>
    )
}

export default FavoritedOptions