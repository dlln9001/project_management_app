import SiteOptionsButton from "./site-options/SiteOptionsButton"

function Topbar() {
    return (
        <div className="flex items-center">
            <img src={process.env.PUBLIC_URL + 'images/TaskTrackLogo.png'} alt="" className="h-9 relative top-2 left-2 mb-3 ml-1"/>
            <SiteOptionsButton/>
        </div>
    )
}

export default Topbar