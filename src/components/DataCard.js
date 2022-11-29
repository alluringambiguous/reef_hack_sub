import React, { useState } from "react"
import Uik from '@reef-defi/ui-kit'
import "./DataCard.css"



function DataCard({ Title, Data, TopContractAddress, Progress, Circle, Link }) {
   
    const [title, setTitle] = useState(Title)
    const [data, setData] = useState(Data)
    const [topContractAddr, setTopContractAddr] = useState(TopContractAddress)
    // const [title,setTitle] = useState()
    // const [title,setTitle] = useState()
    // console.log(Progress)

    const mystyle = {
        backgroundColor: "white",
        width: `${((7-Progress) * 100) / 7}%`,
        height: "6px",
        borderRadius: "2px",
    }

    return (
        <div condensed className="dataCardContainer">
            <div className="titleContainer">{title}</div>

            {data ? (
                <div className="dataContainer">
                    {Data}
                    {Data.length > 13 ? <>...</> : <div></div>}
                </div>
            ) : (
                <div className="dataContainer"></div>
            )}

            <hr
                className="lineContainer"
                style={{
                    background: "#FAFAFA",
                    color: "#FAFAFA",
                    borderColor: "#FAFAFA",
                    height: "1px",
                    margin: 0,
                }}
            />
            <div className="extraContainer">
                {/* {topContractAddr ? (<div >{topContractAddr.slice(0, 18)}...</div>) : (<div></div>)} */}
                {topContractAddr ? (
                    <div>
                        {Progress ? (
                            <div></div>
                        ) : (
                            <div className="viewMoreContainer">View More</div>
                        )}
                    </div>
                ) : (
                    <div className="outerProgressBarContainer">
                        <div
                            className="innerProgressBarContainer"
                            style={mystyle}
                        ></div>
                    </div>
                )}

                {/* <div className="extraContainer">{TopContractAddress}</div> */}
                {/* <div className="linkContainer">{Link}</div> */}
            </div>
        </div>
    )
}

export default DataCard
