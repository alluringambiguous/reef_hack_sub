import React from "react"
// import Discussion from "../components/Discussion"
import { useState, useEffect } from "react"

import contractAddressData from "../constants/contractAddress.json"
import axios from "axios"
import dataConst from "../constants/data.json"
import "./Proposal.css"
import MDEditor from "@uiw/react-md-editor"
import { useParams } from "react-router-dom"

import { web3Accounts, web3Enable } from "@polkadot/extension-dapp"
import { Provider, Signer } from "@reef-defi/evm-provider"
import { WsProvider } from "@polkadot/rpc-provider"
import { Contract } from "ethers"
import GreeterContract from "../contracts/Greeter.json"

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProfilePicture from "../components/ProfilePicture"
// import { useMoralis, useWeb3Contract } from "react-moralis"
// import abi from "../abi.json"
import { Link } from "react-router-dom"
import Alert from "@mui/material/Alert"
import IconButton from "@mui/material/IconButton"
import Collapse from "@mui/material/Collapse"
import Button from "@mui/material/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClose } from "@fortawesome/free-solid-svg-icons"

import {
    faThumbsUp,
    faThumbsDown,
    faComment,
    faAnglesLeft,
} from "@fortawesome/free-solid-svg-icons"

function Proposal({ usradr, setUsrAdr, projectUrl, setProjectUrl }) {
    const [like, setLike] = useState(0)
    const [dislike, setDislike] = useState(0)
    const [openAlert, setOpenAlert] = useState(false)
    const [signer, setSigner] = useState()
    const [isWalletConnected, setWalletConnected] = useState(false)

    const URL = "wss://rpc-testnet.reefscan.com/ws"

    let proposalIpfsHash = window.location.href
    proposalIpfsHash = proposalIpfsHash.split("-")[1]
    const [proposalUrl, setProposalUrl] = useState("")
    const [projectDetails, setProjectDetails] = useState({
        uniqueId: 0,
        uri: "",
        name: "",
        publisher: 0,
        upVotes: 0,
        downVotes: 0,
        markDownData: "",
    })

    const checkExtension = async () => {
        let allInjected = await web3Enable("Reef")

        if (allInjected.length === 0) {
            return false
        }

        let injected
        if (allInjected[0] && allInjected[0].signer) {
            injected = allInjected[0].signer
        }
        // console.log("check extension")
        const evmProvider = new Provider({
            provider: new WsProvider(URL),
        })

        evmProvider.api.on("ready", async () => {
            const allAccounts = await web3Accounts()

            allAccounts[0] && allAccounts[0].address && setWalletConnected(true)
            setWalletConnected(true)

            // console.log(allAccounts)

            const wallet = new Signer(
                evmProvider,
                allAccounts[0].address,
                injected
            )

            // Claim default account
            if (!(await wallet.isClaimed())) {
                console.log(
                    "No claimed EVM account found -> claimed default EVM account: ",
                    await wallet.getAddress()
                )
                await wallet.claimDefaultAccount()
            }
            // console.log("hello form wallet",wallet)
            setSigner(wallet)
            console.log(signer)
        })
    }

    const checkSigner = async () => {
        // console.log("check signer hiiiiiiiii")
        if (!signer) {
            // console.log("no signer")
            await checkExtension()
        }
        return true
    }

    // const contractAddress = contractAddressData.contractAddress

    // const { runContractFunction: proposalDetail } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: contractAddress,
    //     functionName: "proposalDetail",
    //     // update to use uri from component
    //     params: { _uri: proposalUrl },
    // })

    // const { runContractFunction: upVote } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: contractAddress,
    //     functionName: "upVote",
    //     params: {
    //         _uri: proposalUrl,
    //         _voter: "0x88D7abb5D9b3f458976c494E81FF89E88a801da1",
    //     },
    // })
    // const { runContractFunction: downVote } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: contractAddress,
    //     functionName: "downVote",
    //     params: {
    //         _uri: proposalUrl,
    //         _voter: "0x88D7abb5D9b3f458976c494E81FF89E88a801da1",
    //     },
    // })
    // const { runContractFunction: getDownVotes } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: contractAddress,
    //     functionName: "getDownVotes",
    //     params: {
    //         _uri: proposalUrl,
    //     },
    // })
    // const { runContractFunction: getUpVotes } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: contractAddress,
    //     functionName: "getUpVotes",
    //     params: {
    //         _uri: proposalUrl,
    //     },
    // })

    async function updateProposalDetailsFromContract() {
        try {
            const result = await projectDetail()
            // console.log(`data from contract`, result)
            let { uniqueId, uri, projectName, upVotes, downVotes, publisher } =
                result //upvotes, downvotes are BigNumber objs
            //bigint to integer
            upVotes = parseInt(upVotes)
            downVotes = parseInt(downVotes)
            console.log(uri, projectName, upVotes, downVotes, publisher)
            setProposalUrl(uri)
            setProjectDetails((state) => ({
                ...state,
                uniqueId,
                uri,
                projectName,
                upVotes,
                downVotes,
                publisher,
            }))
            console.log(projectDetail)
        } catch (error) {
            console.log(`testFetch error`, error)
            console.log("check if web3 is enabled")
        }
    }

    async function updateProposalDetailsFromIPFS() {
        console.log(
            "thisis the value of prolURL hahahahahahahah",
            proposalIpfsHash.split("+")[1]
        )
        console.log(projectUrl)
        try {
            const response = await axios({
                method: "get",
                url: proposalIpfsHash.split("+")[1],
                // url: "https://gateway.pinata.cloud/ipfs/QmXNJmyjCNKm1AZRhfMnoAYdm9Pm4rwpYdjpcXJ2tBgt7h",
            })

            const { address, markDownData } = await response.data
            console.log("data from IPFS", { address, markDownData })
            setProjectDetails((state) => ({
                ...state,
                markDownData,
            }))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        console.log("web3 enabled? ", signer)
        console.log(
            "proposal opened, proposalUrl (from ipfs hash): ",
            projectUrl
        )

        // get proposal info from contract
        if (signer) {
            updateProposalDetailsFromContract()
            updateProposalDetailsFromIPFS()
        } else if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                checkSigner()
                console.log("enabled web3")
            }
        }
    }, [signer, projectUrl])

    // const handleLike = async () => {
    //     setOpenAlert(true)
    //     await upVote({ onSuccess: (tx) => handleSuccess(tx) })
    // }
    // const handleChange = async (upvotes, downvotes) => {
    //     setLike(parseInt(getUpVotes()))
    //     setDislike(parseInt(getDownVotes()))
    // }
    // const handleSuccess = async (tx) => {
    //     await tx.wait(1)
    //     console.log("success entered")
    //     console.log("tx", tx)
    //     const downvotes = await getDownVotes()
    //     const upvotes = await getUpVotes()
    //     console.log(downvotes)
    //     await handleChange(upvotes, downvotes)
    //     return ["success", tx]
    // }
    // const handleDislike = async () => {
    //     setOpenAlert(true)
    //     await downVote({ onSuccess: (tx) => handleSuccess(tx) })
    // }

    const projectDetail = async () => {
        console.log("waiti for check signer")
        await checkSigner()
        console.log("check signer active", signer)
        const factoryContract = new Contract(
            GreeterContract.address,
            GreeterContract.abi,
            signer
        )
        // console.log("waiting for viewall projects")
        let result = []
        try {
            console.log(GreeterContract.address, GreeterContract.abi, signer)
            result = await factoryContract.projectDetail(
                proposalIpfsHash.split("+")[0]
            )
        } catch (err) {
            // console.log("hello from catch")
            console.log(err)
        }
        // const result = await factoryContract.viewAllProjects()
        // const result =[]
        // console.log("viewall projects returned")

        console.log(result)

        return result
    }

    const getDownVotes = async () => {
        // console.log("waiti for check signer")
        await checkSigner()
        // console.log("check signer active",signer)
        const factoryContract = new Contract(
            GreeterContract.address,
            GreeterContract.abi,
            signer
        )
        // console.log("waiting for viewall projects")
        let result = []
        try {
            console.log(GreeterContract.address, GreeterContract.abi, signer)
            result = await factoryContract.getDownVotes(
                proposalIpfsHash.split("+")[0]
            )
        } catch (err) {
            console.log("hello from catch")
            console.log(err)
        }
        // console.log("downvotes displayed projects returned")

        return result
    }
    const getUpVotes = async () => {
        // console.log("waiti for check signer")
        await checkSigner()
        // console.log("check signer active",signer)
        const factoryContract = new Contract(
            GreeterContract.address,
            GreeterContract.abi,
            signer
        )
        // console.log("waiting for viewall projects")
        let result = []
        try {
            console.log(GreeterContract.address, GreeterContract.abi, signer)
            result = await factoryContract.getUpVotes(
                proposalIpfsHash.split("+")[0]
            )
        } catch (err) {
            // console.log("hello from catch")
            console.log(err)
        }
        // console.log("downvotes displayed projects returned")

        return result
    }

    return (
        <div className="proposalPageDashContainer">
            <Collapse className="alertMainDash" in={openAlert} Alert>
                <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                // setOpenAlert(false)
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
            </Collapse>
            <div className="topIntroBarContainer">
                <Link
                    to="/"
                    style={{
                        marginRight: "auto",
                        textDecoration: "none",
                        color: "black",
                    }}
                >
                    <FontAwesomeIcon
                        icon={faAnglesLeft}
                        className="reactionContainer"
                    />
                    Back
                </Link>
                {usradr ? (
                    <div className="headingProposalPageContainer">
                        {usradr.slice(0, 6)}...
                        {usradr.slice(usradr.length - 4)}{" "}
                    </div>
                ) : (
                    <div className="headingContainer">Hey,</div>
                )}
                <div className="profilePicContainer">
                    {<ProfilePicture address={usradr} />}
                </div>
            </div>

            <div className="proposalContainer">
                <div className="proposalHeading">
                    <div className="proposalName">
                        <h1>{projectDetails.projectName}</h1>
                    </div>
                    <div className="proposalAuthor">
                        <div>by {projectDetails.publisher}</div>
                    </div>
                </div>
                <div className="ProposalBody">
                    <div>
                        {/* TODO: render markup */}
                        <MDEditor.Markdown
                            source={projectDetails.markDownData}
                            style={{
                                whiteSpace: "pre-wrap",
                                backgroundColor: "white",
                                color: "black",
                                padding: "8px",
                            }}
                            className="proposalContent"
                        />
                    </div>
                </div>
                <div className="proposalFooter">
                    <div className="proposalUpVotes">
                        <FontAwesomeIcon
                            icon={faThumbsUp}
                            className="reactionContainer"
                            // onClick={handleLike}
                        />
                        {projectDetails.upVotes}
                    </div>
                    <div className="proposalDownVotes">
                        <FontAwesomeIcon
                            icon={faThumbsDown}
                            className="reactionContainer"
                            // onClick={handleDislike}
                        />{" "}
                        {projectDetails.downVotes}
                    </div>
                </div>

                <div class="solid"></div>

                <div className="proposalDiscussion">
                    {/* <Discussion proposalUrl={proposalUrl} account={usradr} /> */}
                </div>
            </div>
        </div>
    )
}

export default Proposal
