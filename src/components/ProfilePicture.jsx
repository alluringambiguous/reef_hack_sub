import React from "react"


function ProfilePicture({ address }) {
    let number = address % (36);
    console.log(number)
    return (
        <img
            src={`https://api.multiavatar.com/${address}.svg`}
            width="48px"
            height="64px"
        />
    )
}

export default ProfilePicture
