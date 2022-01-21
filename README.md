# blockchain-developer-bootcamp-final-project

# Final Project -- Weather Insurance 

## URL of Deployed dApp
http://addicted-mailbox.surge.sh/

## How to run this project locally:

### Prerequisites
- Node.js >= v14
- Truffle and Ganache 
- `git checkout master`

### Contracts
- Run `npm install` in project root to install Truffle build and smart contract dependencies
- Run local testnet in port 8545 with an Ethereum client, e.g. Ganache
- `truffle migrate --network development`
- `truffle console --network development`
- Run tests in Truffle console: `test`
- Note: due to challenges in setting up tests that involve Chainlink oracles on a local network, the tests written for local testing are minimal. 

- Run `truffle migrate --rinkeby` and then `truffle test test-auxilary/insurancefactory_rinkeby.test.js --rinkeby` in project root to test functionality that involves live Chainlink nodes. Be sure to update your .env file as described below. 
- Note: InsuranceFactory must be funded with LINK and ETH after creation.

### Frontend
- `cd frontend`
- `npm install`
- `npm run`
- Open `http://localhost:3000`

## Screencast link
https://www.loom.com/share/c187757727ef45d389a36b55473f5705

## Public Ethereum wallet for certification:
- 0xE9b70cCB30B0135350aDcCE5Dd76D2E4d01f05D7

## Environment variables (not needed for running project locally)
- RINKEBY_PRIVATE_KEY=
- MNEMONIC=
- RPC_URL=


## Directory structure
- `front:` Project's css/html/javascript frontend.
- `migrations:` Migration files for deploying contracts in contracts directory.
- `contracts:` Smart contracts that are deployed in the Rinkeby testnet.
- `test:` Tests for smart contracts.
- `test-auxilary:` Tests for smart contracts on Rinkeby
- `docs:` further documentation for the project


## Motivation
- As climate change continues to intensify, adverse weather events can be expected to affect a greater number of people, and at greater frequency and severity. 
- A decentralized weather insurance solution could provide automated & trustless claims processing, expand coverage access to more participants, and enable individuals to provide & purchase insurance products in a peer to peer manner.
- I have a personal interest in learning more about real-world data being brought on-chain, particularly now that decentralized oracle solutions such as Chainlink have emerged. 


## What I'd like the project to do (MVP)
A user is able to purchase insurance, and should be payed out an agreed value if no rainfall happens at a specified location for a specified period (i.e. the Claim). The contract(s) will use Chainlink oracles to obtain rainfall data. Upon a Claim being triggered, the contract(s) should ensure the payout to the user takes place by already having the payout ‘locked up’ in advance. If a Claim is not triggered within the specified period, the payout is returned to the insurer.

## Simple workflow
1. Arrive on page
2. Login with MetaMask
3. Specify condititions, create InsuranceContract
4. Confirm with MetaMask
5. Call Get Request Count, observe result
6. Call Update Contract, confirm
7. Call Get Request Count, observe new result


## Full Workflow
###### Preconditions: 
- User has requested an insurance contract with some terms
- User has paid the premium for the insurance contract

###### Flow
0. The Insurer creates a new insuranceFactory, and fund the insuranceFactory with enough ETH and LINK for the factory to create fully-funded insurance contracts. 
1. The Insurer defines terms for new insurance contract 
2. The Insurer generates new insurance contract with enough funds to perform operations for the duration of the contract term
3. The Insurer must call the contract on a daily basis to request rainfall data via chainlink oracles until either (1) the payout condition is met or (2) the end of the contract term. If the Insurer does not request enough updates of the oracle data, the premium is returned to the User and any remaining funds are returned to the Insurer
    1. If the payout condition is met, a payout is made to the User
    2. Else if the end of the contract term is reached, the payout is returned to the Insurer.

###### Postconditions: 
- Insurance contract has been paid out, and is no longer active.

## Down the Road — Nice to Haves
- Automate the updating of oracle data 
- Include the precondition of an insurance request and premium payment as part of the workflow 
- Provide recommendation of reasonable rates, according to the insurance terms requested by the User 
- Implement a tokenized risk pool 
