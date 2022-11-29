# reef_hack_sub
Reef Governance Platform

# Video:
![demo video](https://github.com/alluringambiguous/reef_hack_sub/raw/master/reef.mp4)


# Updated:
* Latest Deployment: [Netlify](https://6385a65b528963465e4dcc53--beautiful-halva-9d585f.netlify.app/)


# How to run locally

## Prereqs:
NPM.

## To run:

```
$ npm install
$ npm run start
```


# Project Story

![Landing Page](https://raw.githubusercontent.com/alluringambiguous/reef_hack_sub/master/a%20landing%20page.png)
*<div align="center"> The Governance Dapp</div>*

## Inspiration

We believe blockchain is run and owned by the masses so important descisions should be voted upon and agreed to democratically by the masses themselves as well. So we bring to the table this Governance dapp,built upon reef chain, that lets you vote for your favourite reef project.
<br><br>
## What it does
The reef governance takes user poll to decide which projects are worth building upon on the reef chain.<br>
Our *"Governance" Dapp* is a intuitive and a community-based web solution that lets users **submit, read, discuss and interact** with proposals published by other users. <br>
The app collects proposal information (i.e. likes, dislikes, proposer etc) **on-chain**. Users can read, vote and discuss the proposals. Further, the top voted proposal is **submitted for funding on a periodic basis**. <br>
 We have launched our app on the Reef testnet.
 
 ![Home page](https://raw.githubusercontent.com/alluringambiguous/reef_hack_sub/master/homepage.png)
 *<div align="center"> Website Homepage </div>*
 
<br><br>
## How we built it
![Architecture](https://raw.githubusercontent.com/alluringambiguous/Frontend-StrawPoll/master/architecture.png)
*<div align="center"> Dapp Architecture </div>*

### Smart Contract
We started with deploying the smart-contract on the reef test net. The smart contract records the details of the proposals and encloses a wide variety of usable functions that provide decentralization to our project.

### Fronted
Then, we build the front-end. We designed the website on **figma** keeping in mind user accesibility. The frontend is written in react. We used **moralis** hooks to connect our smart contract to metamask wallet and to call methods on the smart contract. We have also added packages that provide personalised profile pictures.

### IPFS for Data Storage
We store the proposal metadata on-chain using **ipfs** leveraging **pinata** apis.

### Flask Backend and Database
Each proposal has a discussion page, where users can post comments on the proposal, and vote on other users' comments. These discussions are stored in a **SQL** database connected through **REST API** built on **Flask**. 
<br><br>
## Challenges we ran into
As beginners in reef chain development attempting to build a solution from scratch, we faced a lot of challenges. We learn a lot in the way and overcame most of the challenges!

### What data to upload on chain?
Storing data on chain comes with an extra cost in the form of fees that has to be paid by the user. Data such as the discussion under a proposal can be stored in centralized database with no issues.
The proposal hash is already on the chain which can be used to verify that the proposal is unaltered. <br>



## Accomplishments that we're proud of

On running into all the challenges mentioned above, we read relavant articles, documentations and other literature for days, and finally built a working solution!

### Putting proposal metadata on IPFS
Proposal metadata is put on IPFS. Discussion is built on flask and stored in SQL database. We decided not to put user comments on chain to save gas fees.


### UI/UX Design
We designed a web solution that is more intuitive to use and interact with for users belonging to both technical and non-technical backgrounds. <br><br>

## What we learned

* Quick developement in a fast paced hackathon project
* Chainlink, ipfs, smart contract
* React + moralis, 
* Database, flask, heroku backend
* Worked with team, of developers and UI designers
<br><br>
