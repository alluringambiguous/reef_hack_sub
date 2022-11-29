import React from "react"
import "./Dashboard.css"
import SideNav from "../components/SideNav"
import MainDash from "../components/MainDash"

function Dashboard({ usradr, setUsrAdr, projectUrl, setProjectUrl }) {
    return (
        <div className="dashboardTopContainer">
            <SideNav className="sideNavTopContainer" />

            <MainDash
                className="mainDashTopContainer"
                projectUrl={projectUrl}
                setProjectUrl={setProjectUrl}
                usradr={usradr}
                setUsrAdr={setUsrAdr}
            />
        </div>
    )
}

export default Dashboard
