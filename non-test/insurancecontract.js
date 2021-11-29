

// test createContract()
    // get success / require completion
    // get contract address
    // check new insurance contract is funded 

// get contract rainfall
    // update contract (first)

// get contract request count 
    // update contract (first)

// check contract end 
    // update contract (first)


require("dotenv").config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const mnemonic = process.env.MNEMONIC;
const url = process.env.RPC_URL;

let InsuranceContract = artifacts.require("InsuranceContract");

contract("InsuranceContract", async accounts => {
    const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
    const defaultAccount = accounts[0]

    let insurance_contract, link

    let provider = new HDWalletProvider(mnemonic, url)

    let ORACLE_PAYMENT = 0.1 * 10 ** 17; // 0.01 LINK *
    let LINK_RINKEBY = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709';
    let DROUGHT_THRESHOLD = 30;
    let client = accounts[1];
    let duration = 300;
    let premium = 50;
    let payout = 100;
    let location = "Iowa"

    let fundingAmount = web3.utils.toBN("24426387")

    // @dev sets up LinkToken interface
    beforeEach(async () => {
        LinkToken.setProvider(provider)
        link = await LinkToken.new({ from: defaultAccount })
        console.log('defaultAccount',defaultAccount)
        
        console.log('fundingAmount', "24426387" )
        // oc = await Oracle.new(link.address, { from: defaultAccount })
        console 
        insurance_contract = await InsuranceContract.new('0x2Ec936D225AB1D3927ebe8fA92b905B99b97cc36', DROUGHT_THRESHOLD, duration, premium, payout, location, LINK_RINKEBY, ORACLE_PAYMENT, 
            { from: defaultAccount })

        // await insurance_contract.sendTransaction( {
        //     from: defaultAccount,
        //     value: "24426387"
        // })
  
      //   await oc.setFulfillmentPermission(oracleNode, true, {
      //     from: defaultAccount,
      //   })
    })

    context('creating and using new insurance contract', () => {
        // @dev tests constructor of InsuranceContract. Expected to complete without error, and to return an InsuranceContract instance
        // it('creates a new insurance contract', async () => {
        //     insurance_contract = await InsuranceContract.new(0x2Ec936D225AB1D3927ebe8fA92b905B99b97cc36, DROUGHT_THRESHOLD, duration, premium, payout, location, LINK_RINKEBY, ORACLE_PAYMENT, 
        //         { from: defaultAccount, value: '0000000000244263878' })
        // })

        // @dev tests transfer of LINK to new insurance contract. Expected to complete without error. 
        it('transfers LINK to new insurance contract', async () => {
            await link.transfer(insurance_contract.address, web3.utils.toHex(1e18), { // transfers 1 LINK
                from: defaultAccount,
              })
              console.log('transfered LINK to insurance contract', insurance_factory.address)
        })

        // @dev tests getRequest() from new insurance contract. Expected to complete without error. 
        it('calls getRequestCount()', async () => {            
            let result = await insurance_contract.getRequestCount().call()
        })
    })
})