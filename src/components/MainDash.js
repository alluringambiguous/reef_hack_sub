import React, { useState } from "react"
import IntroBar from "./IntroBar"
import DataBar from "../components/DataBar"
import ProposalBar from "../components/ProposalBar"

import Uik from "@reef-defi/ui-kit"
import "./MainDash.css"

function MainDash({usradr,setUsrAdr, projectUrl, setProjectUrl}) {
	
    const [mainSigner, setMainSigner] = useState()
    const [openAlert, setOpenAlert] = useState(false)
    

    return (
        <div className="mainDashContainer">
            {/* <Collapse className="alertMainDash" in={openAlert} Alert>
                <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            
                            onClick={() => {
                                setOpenAlert(false)
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faClose}
                                width={16}
                                className="downArrowContainer"
                            />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    Please refresh the page after a short while!!
                </Alert>
            </Collapse> */}
            <IntroBar userAddr={usradr} setUserAddr={setUsrAdr} mainSigner={mainSigner} setMainSigner={setMainSigner} />
            <DataBar className="dataBarContainer"/>
            <ProposalBar projectUrl = { projectUrl} setProjectUrl ={ setProjectUrl} userAddr={usradr} setUserAddr={setUsrAdr} mainSigner={mainSigner}  setOpenAlert={setOpenAlert} />
        </div>
    )
}

export default MainDash
