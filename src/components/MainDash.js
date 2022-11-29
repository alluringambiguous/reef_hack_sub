import React, { useState } from "react"
import IntroBar from "./IntroBar"
import DataBar from "../components/DataBar"
import ProposalBar from "../components/ProposalBar"
import Spinner from "../components/Spinner"
import Uik from "@reef-defi/ui-kit"
import "./MainDash.css"

function MainDash({ usradr, setUsrAdr, projectUrl, setProjectUrl }) {
    const [mainSigner, setMainSigner] = useState()
    const [openAlert, setOpenAlert] = useState(false)
    const [isLoading, setIsLoading] = useState("DONE")
    console.log(isLoading)
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
            {/* {isLoading !== "DONE" ? (
                <><Spinner className="spinnerMainContainer" isLoading={isLoading}
                        setIsLoading={setIsLoading}/></>
            ) : (
                <> */}
                    <IntroBar
                        userAddr={usradr}
                        setUserAddr={setUsrAdr}
                        mainSigner={mainSigner}
                        setMainSigner={setMainSigner}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                    />
                    <DataBar
                        className="dataBarContainer"
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                    />
                    <ProposalBar
                        projectUrl={projectUrl}
                        setProjectUrl={setProjectUrl}
                        userAddr={usradr}
                        setUserAddr={setUsrAdr}
                        mainSigner={mainSigner}
                        setOpenAlert={setOpenAlert}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                    />
                {/* </>
            )} */}
        </div>
    )
}

export default MainDash
