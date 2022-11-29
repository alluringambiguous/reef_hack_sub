import SideNav from '../components/SideNav'
import Proposal from "./Proposal.jsx"
import React from 'react'

function ProposalPage( {usradr ,setUsrAdr,projectUrl,setProjectUrl}) {
  return (
    <div className='dashboardContainer'><SideNav className="sideNavTopContainer"/><Proposal className="mainDashTopContainer"  projectUrl = {projectUrl} setPojectUrl ={setProjectUrl} usradr={usradr} setUsrAdr={setUsrAdr}/></div>
  )
}

export default ProposalPage

