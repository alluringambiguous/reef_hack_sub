import React, { useState, useEffect } from "react"
import "./ProposalBar.css"
import ProposalCard from "./ProposalCard"
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp"
import { Provider, Signer } from "@reef-defi/evm-provider"
import { WsProvider } from "@polkadot/rpc-provider"
import { Contract } from "ethers"
import GreeterContract from "../contracts/Greeter.json"
import FactoryAbi from "../constants/abi.json"
import factoryContractAddress from "../constants/contractAddress.json"
import Uik from "@reef-defi/ui-kit"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faPlus,
    faArrowDown,
    faArrowUp,
    faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons"
import ModalTab from './Modal'

function ProposalBar({ userAddr, setOpenAlert, setUserAddr, projectUrl, setProjectUrl, setIsLoading}) {
    const [proposals, setProposals] = useState([])
    const [open, setOpen] = React.useState(false)
    const [sortLatestFirst, setSortLatestFirst] = useState(true)
    
    

    const [signer, setSigner] = useState()
    const [isWalletConnected, setWalletConnected] = useState(false)

    
    const URL = "wss://rpc-testnet.reefscan.com/ws"

    // console.log(` this is in proposal ${userAddr}`)

    // console.log(contractAddress.contractAddress)

    // console.log(open)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

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

    // const viewAllProjects = async () => {

    //     await checkSigner()
    //     const factoryContract = new Contract(
    //         factoryContractAddress.contractAddress,
    //         FactoryAbi.abi,
    //         signer
    //   )
    //     console.log("this is the function you are looking in")

    //     const result = await factoryContract.viewAllProjects()

    //     console.log(result)

    // }
    // var contractAddrTemp = 0xBEC38F217596AC6835ef2b9e667acE177Be928E2;
    const viewAllProjects = async () => {
        console.log("waiti for check signer")
        await checkSigner()
        console.log("check signer active",signer)
        const factoryContract = new Contract(
            GreeterContract.address,
            GreeterContract.abi,
            signer
        )
        // console.log("waiting for viewall projects")
        let result = []
        try {
            console.log( GreeterContract.address,GreeterContract.abi,signer)
            result = await factoryContract.viewAllProjects()
            // setIsLoading("ALL PROJECTS LOADED")
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

    useEffect(async () => {
        console.log({isWalletConnected},"next comes updateui")
        async function updateUi() {  
            
            console.log("calling viewallprojects form useeffect")
            const allProposalsFromContract = await viewAllProjects()

            let allProposalsCleaned = []
            console.log(userAddr)
            if (userAddr)
                for (var i = 0; i < allProposalsFromContract.length; i++) {
                    const {
                        projectName,
                        uri,
                        publisher,
                        upVotes,
                        downVotes,
                        uniqueId
                    } = await allProposalsFromContract[i]
                    const uniqueid = parseInt(uniqueId)
                    const upvotes = parseInt(upVotes)
                    const downvotes = parseInt(downVotes)
                    // console.log(api.tx.system.remarkWithEvent('anighma').method.hash.toHex())

                    // console.log(`${txHash}`)

                    allProposalsCleaned.push({
                        projectName,
                        uri,
                        publisher,
                        upvotes,
                        downvotes,
                        uniqueid
                    })
                }
            console.log("ready to set proposal")
            if (allProposalsCleaned.length == 0) {
                return
            }
            setProposals(
                allProposalsCleaned
                    .map((proposal, i) => {
                        return (
                            <ProposalCard
                                key={i}
                                name={proposal.projectName}
                                uri={proposal.uri}
                                proposer={proposal.publisher}
                                upvote={proposal.upvotes}
                                downvote={proposal.downvotes}
                                uniqueId={proposal.uniqueid}
                                setOpenAlert={setOpenAlert}                        
                            />
                        )
                    })
                    .reverse()
            )
            // setIsLoading("DONE")
        }
        // setIsLoading("upadateUI called")
        updateUi()
        
    }, [signer,userAddr])
    

    // for (var i = 0; i < temp.length; i++) {
    //     setProposals((oldArray) => [...oldArray, <ProposalCard />])
    // }

    return (
        <div className="proposalBarContainer">
            <div className="titleProposalContainer">
                <div className="sortingContainer">
                    <div className="sortingOptionContainer">
                        <div className="titleProposalTopContainer">
                            Latest Proposals
                        </div>
                        <div
                            className="titleProposalTopUnselectedContainer"
                            onClick={() => {
                                setSortLatestFirst(!sortLatestFirst)
                                setProposals(proposals.reverse())
                            }}
                        >
                            <div>Sort by</div>
                            <FontAwesomeIcon
                                icon={sortLatestFirst ? faArrowUp : faArrowDown}
                                width={16}
                                className="downArrowContainer"
                            />
                        </div>
                        <div className="titleProposalTopUnselectedContainer">
                            <div>Your Proposals</div>
                        </div>
                    </div>
                    <hr
                        className="lineSortContainer"
                        style={{
                            background: "#b3b3b3 ",
                            color: "#b3b3b3 ",
                            borderWidth: "0px",
                            height: "1.5px",
                            width: "90%",
                        }}
                    />
                </div>

                <div className="searchBarContainer">
                    <div className="searchNameContainer">Search</div>

                    <FontAwesomeIcon icon={faMagnifyingGlass} width={16} />
                </div>

                <Uik.Button  fill right text="Add Proposal"  icon={faPlus} onClick={handleOpen} className="addProposalContainer">
                    {/* <div className="addProposalButtonContainer">
                        Add Proposal
                    </div>
                    <FontAwesomeIcon
                        icon={faPlus}
                        width={16}
                        className="plusContainer"
                    /> */}
                </Uik.Button>
            </div>
            <ModalTab
                userAddr={userAddr}
                mainsigner={signer}
                projectUrl = { projectUrl} setProjectUrl ={ setProjectUrl}
        open={open}
        handleClose={handleClose}
        setOpenAlert={setOpenAlert}
      />
            <div className="proposalCardsContainer">{proposals }</div>
        </div>
    )
}

export default ProposalBar
