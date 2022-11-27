import React, { useState, useEffect } from 'react'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { Provider, Signer } from '@reef-defi/evm-provider'
import { WsProvider } from '@polkadot/rpc-provider'
import { Contract } from 'ethers'
import GreeterContract from '../contracts/Greeter.json'
import Uik from '@reef-defi/ui-kit'
import "./IntroBar.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faCircle } from "@fortawesome/free-solid-svg-icons"
import ProfilePicture from "./ProfilePicture"


const FactoryAbi = GreeterContract.abi
const factoryContractAddress = GreeterContract.address

const URL = 'wss://rpc-testnet.reefscan.com/ws'

function IntroBar({ userAddr, setUserAddr }) {
  const [msgVal, setMsgVal] = useState('')
  const [msg, setMsg] = useState('')
  const [signer, setSigner] = useState()
  const [isWalletConnected, setWalletConnected] = useState(false)

  const checkExtension = async () => {
    let allInjected = await web3Enable('Reef')

    if (allInjected.length === 0) {
      return false
    }

    let injected
    if (allInjected[0] && allInjected[0].signer) {
      injected = allInjected[0].signer
    }

    const evmProvider = new Provider({
      provider: new WsProvider(URL),
    })
    // console.log(URL);
    evmProvider.api.on('ready', async () => {
      const allAccounts = await web3Accounts()

      allAccounts[0] && allAccounts[0].address && setWalletConnected(true)

      // console.log(allAccounts)

      const wallet = new Signer(evmProvider, allAccounts[0].address, injected)

      // Claim default account
      if (!(await wallet.isClaimed())) {
        console.log(
          'No claimed EVM account found -> claimed default EVM account: ',
          await wallet.getAddress(),
        )
        await wallet.claimDefaultAccount()
      }

      setSigner(wallet)
    })
  }

  const checkSigner = async () => {
    if (!signer) {
      await checkExtension()
    }
    return true
  }
  const getGreeting = async () => {
    await checkSigner()
    const factoryContract = new Contract(
      factoryContractAddress,
      FactoryAbi,
      signer,
    )
    const result = await factoryContract.greet()
    setMsg(result)
  }

  const setGreeting = async () => {
    await checkSigner()
    const factoryContract = new Contract(
      factoryContractAddress,
      FactoryAbi,
      signer,
    )
    await factoryContract.setGreeting(msgVal)
    setMsgVal('')
    getGreeting()
  }
  useEffect(() => {
        if (isWalletConnected) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                checkExtension()
                 { signer?setUserAddr(signer._substrateAddress):(<></>) }
                // console.log(userAddr)
            }
        }
    }, [isWalletConnected])
    useEffect(() => {
        { signer?setUserAddr(signer._substrateAddress):(<></>) }
        // console.log(userAddr)
    }, [signer])
   

  return (
    <Uik.Container>
      
          <div className="introBarContainer">
            <div className="welcomeContainer">
                {signer ? (
                    <div className="headingContainer">
                        Hi, {signer._substrateAddress.slice(0, 6)}...
                        {signer._substrateAddress.slice(signer._substrateAddress.length - 4)}{" "}
                    </div>
                ) : (
                    <div className="headingContainer">Hey,</div>
                )}
                <div className="descContainer">
                    Welcome, check the lastest proposals this week
                </div>
            </div>
            <div className="profileContainer">
                <div className="notifContainer">
                    <FontAwesomeIcon icon={faBell} />
                </div>
                <div className="profilePicContainer">
                    {signer?<ProfilePicture address={signer._substrateAddress} />:<></>}
                </div>
            </div>
            <div className="connectButtonContainer">
                {signer ? (
                    <div className="connectedWalletContainer">
                        <FontAwesomeIcon
                            icon={faCircle}
                            width={8}
                            className="indicatorContainer"
                        />
                        <div>Connected</div>
                    </div>
                ) : (
                    <Uik.Button
                        
                        onClick={async () => {
                            await checkExtension()
                            if (typeof window !== "undefined") {
                                window.localStorage.setItem(
                                    "connected",
                                    "injected"
                                )
                            }
                            // setUserAddr(signer._substrateAddress)
                            // console.log(userAddr)
                        }}
                        // disabled={isWeb3EnableLoading}
                    >
                        Connect Wallet
                          </Uik.Button>
                          
                )}
            </div>
        </div>
    </Uik.Container>
  )
}

export default IntroBar
