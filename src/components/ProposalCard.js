import React, { useState, useEffect } from "react"
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp"
import { Provider, Signer } from "@reef-defi/evm-provider"
import { WsProvider } from "@polkadot/rpc-provider"
import { Contract } from "ethers"
import GreeterContract from "../contracts/Greeter.json"
import { ApiPromise } from "@polkadot/api"
import { options } from "@reef-defi/api"
import { Link } from "react-router-dom"

import "./ProposalCard.css"
// import Alert from "@mui/material/Alert"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faThumbsUp,
    faThumbsDown,
    faComment,
    faTrash,
} from "@fortawesome/free-solid-svg-icons"

import ProfilePicture from "./ProfilePicture"

function ProposalCard({
    name,
    uri,
    proposer,
    upvote,
    downvote,
    uniqueId,
    setOpenAlert,
}) {
    const [like, setLike] = useState(upvote)
    const [dislike, setDislike] = useState(downvote)
    const [signer, setSigner] = useState()
    const [isWalletConnected, setWalletConnected] = useState(false)
    const [evmAcc, setEvmAcc] = useState()
    // const contractAddress = contractAddressData.contractAddress
    // const [userCardAddr,setUserCardAddr] = useState(account)
    // console.log(`thsi is in propsoal card${account}`)
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
            console.log("hello form wallet", wallet)
            setSigner(wallet)
            console.log(signer)
        })
    }

    const checkSigner = async () => {
        console.log("check signer hiiiiiiiii")
        if (!signer) {
            console.log("no signer")
            await checkExtension()
        }
        return true
    }
    const getEvmAddress = async (substractAddr) => {
        const provider = new WsProvider(URL)
        const api = new ApiPromise(options({ provider }))
        await api.isReady
        console.log("started evm ")
        const data = await api.query.evmAccounts.evmAddresses(substractAddr)
        console.log("got the evm addr", data.toHuman())
        setEvmAcc(data.toHuman())
        return data.toHuman()
    }

    const upVote = async () => {
        // console.log("waiti for check signer in upvote")
        await checkSigner()
        // console.log("check signer active in upvote",signer)
        const factoryContract = new Contract(
            GreeterContract.address,
            GreeterContract.abi,
            signer
        )
        // console.log("waiting for viewall projects")

        try {
            // console.log("just before upVote function api call", GreeterContract.address, GreeterContract.abi, signer)
            const addr = await getEvmAddress(signer._substrateAddress)
            // console.log("the evm complatible address is",addr)
            // const addr = "0x"+signer._substrateAddress
            await factoryContract.upVote(uniqueId, addr)
        } catch (err) {
            // console.log("hello from catch")
            console.log(err)
        }
        // console.log("upvote projects returned")
    }
    const downVote = async () => {
        // console.log("waiti for check signer")
        await checkSigner()
        // console.log("check signer active",signer)
        const factoryContract = new Contract(
            GreeterContract.address,
            GreeterContract.abi,
            signer
        )
        // console.log("waiting for viewall projects")

        try {
            console.log(GreeterContract.address, GreeterContract.abi, signer)
            const addr = await getEvmAddress(signer._substrateAddress)
            await factoryContract.downVote(uniqueId, addr)
        } catch (err) {
            // console.log("hello from catch")
            console.log(err)
        }
        // console.log("downvote projects returned")
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
            result = await factoryContract.getDownVotes(uniqueId)
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
            result = await factoryContract.getUpVotes(uniqueId)
        } catch (err) {
            // console.log("hello from catch")
            console.log(err)
        }
        // console.log("downvotes displayed projects returned")

        return result
    }

    const handleLike = async () => {
        // setOpenAlert(true)
        await upVote({ onSuccess: (tx) => handleSuccess(tx) })
    }
    const handleChange = async (upvotes, downvotes) => {
        setLike(parseInt(upvotes))
        setDislike(parseInt(downvotes))
    }
    const handleSuccess = async (tx) => {
        await tx.wait(1)
        console.log("success entered")
        console.log("tx", tx)
        const downvotes = await getDownVotes()
        const upvotes = await getUpVotes()
        console.log(downvotes)
        await handleChange(upvotes, downvotes)
        return ["success", tx]
    }
    const handleDislike = async () => {
        // setOpenAlert(true)
        await downVote({ onSuccess: (tx) => handleSuccess(tx) })
    }

    return (
        <div className="proposalCardContainer">
            <div className="porposalCardDataContainer">
                <div className="proposalCircleContainer">
                    {proposer ? <ProfilePicture address={proposer} /> : <></>}
                </div>
                <div className="proposalAuthorDataContainer">
                    <Link
                        to={`/-${uniqueId}+${uri}`}
                        key="proposalIpfsHash"
                        style={{ textDecoration: "none" }}
                        className="proposalTitleContainer"
                    >
                        {name ? (
                            <div style={{ display: "flex", width: "100%" }}>
                                {name.slice(0, 18)}
                                {name.length > 18 ? <>...</> : <div></div>}

                                {/* {proposer ===
                                "0xD3Ff96cf6925a905dce544140F06B9745e2bcBae" ? (
                                    <div style={{ marginLeft: "auto" }}>
                                        
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            style={{ width: " 12px" }}
                                            className="trashContainer"
                                        />
                                    </div>
                                ) : (
                                    <div></div>
                                )} */}
                                {/* <div ></div> */}
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </Link>
                    {proposer ? (
                        <div className="proposalAuthorContainer">
                            {proposer.slice(0,4)}...{proposer.slice(proposer.length-4)}
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
            <div className="proposalReactionsContainer">
                <div className="proposalReactionContainer">
                    <FontAwesomeIcon
                        icon={faThumbsUp}
                        onClick={async () => {
                            handleLike()
                        }}
                        className="reactionContainer"
                    />
                    <div>{like}</div>
                </div>
                <div className="proposalReactionContainer">
                    <FontAwesomeIcon
                        icon={faThumbsDown}
                        onClick={async () => {
                            handleDislike()
                        }}
                        className="reactionContainer"
                    />

                    <div>{dislike}</div>
                </div>
                <div className="proposalReactionContainer">
                    <FontAwesomeIcon
                        icon={faComment}
                        className="reactionContainer"
                    />
                    <div>{0}</div>
                </div>
            </div>
        </div>
    )
}

export default ProposalCard
