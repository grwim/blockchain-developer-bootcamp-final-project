# blockchain-developer-bootcamp-final-project

# weather insurance 

## Motivation
- As climate change continues to intensify, adverse weather events can be expected to affect a greater number of people, and at greater frequency and severity. 
- A decentralized weather insurance solution could provide automated & trustless claims processing, expand coverage access to more participants, and enable individuals to provide & purchase insurance products in a peer to peer manner .
- I have a personal interest in learning more about real-world data being brought on-chain, particularly now that decentralized oracle solutions such as Chainlink have emerged. 

## What id like the project to do (MVP)
A user is able to purchase insurance, and should be payed out an agreed value if no rainfall happens at a specified location for a specified period (i.e. the Claim). The contract(s) will use Chainlink oracles to obtain rainfall data. Upon a Claim being triggered, the contract(s) should ensure the payout to the user takes place by already having the payout ‘locked up’ in advance. If a Claim is not triggered within the specified period, the payout is returned to the insurer.

## Example Workflow
###### Preconditions: 
- User has requested an insurance contract with some terms
- User has paid the premium for the insurance contract

###### Flow
1. The Insurer defines terms for new insurance contract 
2. The Insurer generates new insurance contract with enough funds to perform operations for the duration of the contract term
3. The Insurer must call the contract on a daily basis to request rainfall data via chainlink oracles until either (1) the payout condition is met or (2) the end of the contract term. If the Insurer does not request enough updates of the oracle data, the premium is returned to the User and any remaining funds are returned to the Insurer
    1. If the payout condition is met, a payout is made to the User
    2. Else if the end of the contract term is reached, the payout is returned to the Insurer.

###### Postconditions: 
- Insurance contract has been paid out, and is no longer active.

## Beyond the MVP — Nice to Haves
- Source data from multiple sources to reduce integrity risks with any single source. 
- Automate the updating of oracle data 
- Include the precondition of an insurance request and premium payment as part of the workflow 
- Provide recommendation of reasonable rates, according to the insurance terms requested by the User 
- Implement a tokenized risk pool 
