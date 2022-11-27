import React, { useState, useEffect } from "react"
import Modal from "@mui/material/Modal"
// import { Snackbar, Alert } from "@mui/material"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import "./Modal.css"
import MDEditor from "@uiw/react-md-editor"
import axios from "axios"
import dataConst from "../constants/data.json"
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp"
import { Provider, Signer } from "@reef-defi/evm-provider"
import { WsProvider } from "@polkadot/rpc-provider"

import { Contract } from "ethers"
import GreeterContract from "../contracts/Greeter.json"

function ModalTab({ userAddr,mainsigner, open, handleClose, setOpenAlert , projectUrl, setProjectUrl} ) {
    const [title, setTitle] = React.useState("")
    const [openSnack, setOpenSnack] = React.useState(false)
    
    const [markDownValue, setMarkDownValue] = React.useState(
        "type proposal here ...."
    )
    const [signer, setSigner] = useState()
    const [isWalletConnected, setWalletConnected] = useState(false)
    const URL = "wss://rpc-testnet.reefscan.com/ws"


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

    const addProject = async () => {
        console.log("waiti for check signer")
        await checkSigner()
        console.log("check signer active", signer)
        const factoryContract = new Contract(
            GreeterContract.address,
            GreeterContract.abi,
            mainsigner
        )
        // console.log("waiting for viewall projects")
        let result = []
        try {
            console.log(GreeterContract.address, GreeterContract.abi, mainsigner)
            result = await factoryContract.addProject(title,userAddr,projectUrl)
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

    // async function sendProposalUrlToPythonBackend() {
    //     const pythonApiPrefix = dataConst.pythonApiPrefix
    //     const newDiscussionEndpoint = `${pythonApiPrefix}/discussions`

    //     try {
    //         console.log(
    //             "sending proposal url to python backend : ",
    //             newDiscussionEndpoint
    //         )
    //         const response = await axios({
    //             method: "post",
    //             url: newDiscussionEndpoint,
    //             data: { proposal_url: proposalUrl },
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Access-Control-Allow-Origin": "*",
    //             },
    //         })
    //         console.log("response from python backend : ", response)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const handleClick = async () => {
        console.log(userAddr)
        console.log(markDownValue)
        console.log("entered...")
        handleClose()
        setOpenAlert(true)

        try {
            // uploading to ipfs
            const resJson = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
                data: { address: userAddr, markDownData: markDownValue },
                headers: {
                    pinata_api_key: dataConst.pinataApi,
                    pinata_secret_api_key: dataConst.pinataApiSecret,
                },
            })

            // get ipfs url and store for later use
            const ipfsHash = await resJson.data.IpfsHash
            const url_string = dataConst.ipfsUrlPrefix + "/" + ipfsHash

            console.log("final ipfs url string", `${url_string}`)
            setProjectUrl(url_string)
            console.log("this is the value assigned to the variable : ",projectUrl)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleProposalUrlUpdate() {
        if (projectUrl !== "") {
            console.log(
                "proposalUrl state set, trying to send changes",
                projectUrl
            )
            await addProject()
            // await sendProposalUrlToPythonBackend()
        }
    }

    useEffect(() => {
        console.log("adding proposal")
        handleProposalUrlUpdate()
    }, [projectUrl])

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            radius="10px"
            className="modalContainer"
        >
            <div className="modalStyleContainer">
                <Box
                    className="boxStyleContainer"
                    component="form"
                    noValidate
                    autoComplete="off"
                >
                    <div className="modalHeadMessage1">Have a new idea?</div>
                    {/* <div className="modalHeadMessage2">Let everyone know </div> */}
                    <div className="proposerAddressContainer">
                        <div>Proposer's Address :</div> <div>{userAddr}</div>
                    </div>
                    <TextField
                        id="filled"
                        label="Proposal's Title"
                        value={title}
                        variant="filled"
                        onChange={handleTitleChange}
                        sx={{
                            bgcolor: "white",
                            marginTop: "16px",
                            marginBottom: "16px",
                            width: { sm: 800 },
                            multilineColor: "secondary",
                        }}
                    />
                    <MDEditor
                        value={markDownValue}
                        onChange={setMarkDownValue}
                        className="editorContainer"
                    ></MDEditor>
                    <div className="buttonModalContainer" onClick={handleClick}>
                        Submit
                    </div>
                </Box>
            </div>
        </Modal>
    )
}

export default ModalTab
