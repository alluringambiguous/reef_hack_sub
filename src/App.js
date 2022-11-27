import "./App.css"
import Dashboard from "./pages/Dashboard"
import ProposalPage from "./pages/ProposalPage.js"
import React, { useState, useEffect } from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"

// import LandingPage from "./pages/Landing"

// import { BrowserRouter, Route } from 'react-router-dom'

function App() {
    const [usradr, setUsrAdr] = useState()
    const [projectUrl, setProjectUrl] = React.useState("hey")
    // function HomePage() {
    //   return <div className="container"></div>
    // }

    // function ProposalPage() {
    //     return (
    //         <div className="container">
    //             {/* <SideNav className="sideContainer" /> */}
    //             {/* <Proposal url="testing..." className="proposalContainer" /> */}
    //         </div>)
    // }

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <Dashboard projectUrl = {projectUrl} setProjectUrl ={setProjectUrl} usradr={usradr} setUsrAdr={setUsrAdr} />
                </Route>
                <Route path="/:proposalIpfsHash">
                    <ProposalPage projectUrl = {projectUrl} setProjectUrl ={setProjectUrl} usradr={usradr} setUsrAdr={setUsrAdr} />{" "}
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export default App
