import React, { useEffect, useState } from "react"
import "./DataBar.css"
import DataCard from "./DataCard"
import Uik from '@reef-defi/ui-kit'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { Provider, Signer } from '@reef-defi/evm-provider'
import { WsProvider } from '@polkadot/rpc-provider'
import Uik from '@reef-defi/ui-kit'




function DataBar() {
    const [topAddr, setTopAddr] = useState()
    const [topName, setTopName] = useState("")
    const [card, setCard] = useState([])

    
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

    evmProvider.api.on('ready', async () => {
      const allAccounts = await web3Accounts()

      allAccounts[0] && allAccounts[0].address && setWalletConnected(true)

      console.log(allAccounts)

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

    
    
    async function updateUi() {
        const topCont = 0x1234
        const glmrToUsd = 6
        const topA = topCont
        const topN = topCont
        setCard([])
        // console.log("hello")
        let weekday = new Date().getDay()
        // console.log(weekday)
        let dayLeft = 7 - weekday

        console.log(topCont.uri)
        setTopName(topN)
        setTopAddr(topA)
        // console.log(topName)
        setCard((oldArray) => [
            ...oldArray,
            [
                <DataCard
                    key={1}
                    Title={"This Weeks Top Proposal"}
                    Data={topN}
                    TopContractAddress={topA}
                />,
                <DataCard
                    key={2}
                    Title={"GLMR Price"}
                    Data={`$ ${Math.round(glmrToUsd / 40833 * 10000) / 10000}`}
                    TopContractAddress={"http://glmrtousdconverter"}
                />,
                <DataCard
                    key={3}
                    Title={"Push for Governance in"}
                    Data={`${dayLeft} days to go`}
                    
                    Progress={dayLeft}
                />,
                <DataCard
                    key={4}
                    Title={"Last Weeks Top Proposal"}
                    Data={"NaN"}
                    TopContractAddress={"0xurietyoreitweoriutw"}
                />,
            ],
        ])
    }

    useEffect(() => {
        updateUi()
    }, [isWalletConnected])
    return (
        <div className="dataBarContainer">
            <div className="tempContainer">
                {card}
                {/* <DataCard
                    Title={"This Weeks Top Proposal"}
                    Data={topName}
                    Link={"http:/ex...s.com"}
                    TopContractAddress = {topAddr}
                /> */}
                {/* <DataCard Title={"Price of GLMR"} Data={"$ 0.52"} />
                <DataCard
                    Title={"Next Burn"}
                    Data={"4 Days"}
                    Circle={"4/7 in circle form"}
                />
                <DataCard
                    Title={"Last Weeks Top Proposal"}
                    Data={"0xd34w...45fd"}
                    Link={"http:/ex...s.com"}
                /> */}
            </div>
        </div>
    )
}

export default DataBar
