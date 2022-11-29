import SideNav from '../components/SideNav'
import Proposal from "./Proposal.jsx"
import React from 'react'
import "./ProposalPage.css"



function ProposalPage( {usradr ,setUsrAdr,projectUrl,setProjectUrl}) {
  return (
    <div className='proposalPagePropContainer'><SideNav className="sideNavTopContainer"/><Proposal className="mainDashTopContainer"  projectUrl = {projectUrl} setPojectUrl ={setProjectUrl} usradr={usradr} setUsrAdr={setUsrAdr}/></div>
  )
}

export default ProposalPage

