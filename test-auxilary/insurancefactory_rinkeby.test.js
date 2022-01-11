//const { oracle } = require('@chainlink/test-helpers')
// const { expectRevert, time } = require('@openzeppelin/test-helpers')

require("dotenv").config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = process.env.MNEMONIC;
const url = process.env.RPC_URL;

const InsuranceFactory = artifacts.require("InsuranceFactory");
let InsuranceContract = artifacts.require("InsuranceContract");

const { expectRevert, time, provider } = require('@openzeppelin/test-helpers')

// test getLatestPrice()

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
  

contract("InsuranceFactory", async accounts => {
    // NEED TO FuND INSURANCE CONTRACT
    const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
    // const { LinkToken } = require('../node_modules/@chainlink/contracts/src/v0.4/LinkToken.sol')
    // const { Oracle } = require('@chainlink/contracts/truffle/v0.6/Oracle')
    // const MyContract = artifacts.require('MyContract')
    
    console.log('mnemonic', mnemonic)
    console.log('url', url)

    let provider = new HDWalletProvider(mnemonic, url)

    const defaultAccount = accounts[0]
    // const oracleNode = accounts[1]
    // const stranger = accounts[2]
    // const consumer = accounts[3]
  
    // These parameters are used to validate the data was received
    // on the deployed oracle contract. The Job ID only represents
    // the type of data, but will not work on a public testnet.
    // For the latest JobIDs, visit a node listing service like:
    // https://market.link/
    // const jobId = web3.utils.toHex('4c7b7ffb66b344fbaa64995af81e355a')
    // const url =
      'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,JPY'
    // const path = 'USD'
    // const times = 100
  
    // Represents 1 LINK for testnet requests
    const payment = web3.utils.toWei('1')
  
    let link, oc, insurance_factory

    let insurance_contract_address



    context('Without LINK', () => {
      /// @dev tests that a new insurance factory can be created
      it('a new insurance factory can be created', async () => {
        await InsuranceFactory.new( { from: defaultAccount })
      })
    })
  
    beforeEach(async () => {
      LinkToken.setProvider(provider)
      link = await LinkToken.new({ from: defaultAccount })
      console.log('defaultAccount',defaultAccount)
      // oc = await Oracle.new(link.address, { from: defaultAccount })

    //   insurance_factory = await InsuranceFactory.new( { from: consumer })
      insurance_factory = await InsuranceFactory.new( { from: defaultAccount })
      // console.log('insurance_factory', insurance_factory) 

    //   await oc.setFulfillmentPermission(oracleNode, true, {
    //     from: defaultAccount,
    //   })
    })

    describe('#use Insurance Factory', () => {
        // context('without LINK', () => {
        //   it('reverts', async () => {
        //     await expectRevert.unspecified(
        //         insurance_factory.createContract('0x2Ec936D225AB1D3927ebe8fA92b905B99b97cc36', 300, 50, 100, 'Iowa', { from: 
        //             defaultAccount
        //         })
        //     //     insurance_factory.createRequestTo(oc.address, jobId, payment, url, path, times, {
        //     //     from: consumer,
        //     //   }),
        //     )
        //   })
        // })

    
        context('with LINK', () => { 
          let request
    
          beforeEach(async () => {
            await link.transfer(insurance_factory.address, web3.utils.toHex(1e18), { // transfers 1 LINK
              from: defaultAccount,
            })
            console.log('transfered LINK to insurance factory', insurance_factory.address)
          })
    
          context('creating a new insurance contract', () => {
            /// @dev tests the funding of an insurance factory once created. expect to be able to fund with LINK & ETH without revert
            it('creates a new insurance contract and is funded with LINK & ETH', async () => {
                
              await insurance_factory.sendTransaction( {
                  from: defaultAccount,
                  value: web3.utils.toWei('.01', 'ether')
              })
              
              console.log('transfered ETH to insurance factory: ', insurance_factory.address)

              console.log('attempting to create a new insurance contract')

              const result = await insurance_factory.createContract('0x2Ec936D225AB1D3927ebe8fA92b905B99b97cc36', 3, 30, 50, 100, 'Iowa', { from: 
                      defaultAccount
                })

              console.log('result', result)
              let log = result.logs[0];
              contractAddress = log.address
              console.log('contractAddress', contractAddress)

              insurance_contract_address = contractAddress

              // console.log('.events.contractCreated.returnValues[0]', result.events.contractCreated.returnValues[0])

              // let InsuranceContract = await InsuranceContract.at('my contract address');

              // console.log('result', result)
              //   request = oracle.decodeRunRequest(tx.receipt.rawLogs[3])
              //   assert.equal(oc.address, tx.receipt.rawLogs[3].address)
              //   assert.equal(
              //     request.topic,
              //     web3.utils.keccak256(
              //       'OracleRequest(bytes32,address,bytes32,uint256,address,bytes4,uint256,uint256,bytes)',
              //     ),
              //   )
            })

            /// @dev tests transfer of LINK to new insurance contract. Expect no revert
            it('tranfers LINK to the new insurance contract', async () => {

              let link_transfer_result = await link.transfer(insurance_contract_address, web3.utils.toHex(1e17), { // transfers 1 LINK
                from: defaultAccount,
              })

              console.log('link_transfer_result', link_transfer_result)
            })

            /// @dev gets the current rainfall from the location specified in the new insurance contract. Expect no revert
            it('it gets the insurance contracts rainfall', async () => {

              await insurance_factory.updateContract(insurance_contract_address)
              let rainfall_result = await insurance_factory.getContractRainfall(insurance_contract_address)

              console.log('rainfall value', rainfall_result.receipt.rawLogs.data)
          })

          /// @dev tests requested call of getContractRequestCount() from new insurance contract. Expect no revert
          it('it gets the insurance contracts contractRequestCount', async () => {
            await insurance_factory.updateContract(insurance_contract_address)
            let request_result = await insurance_factory.getContractRequestCount(insurance_contract_address)

            console.log('request result', request_result.receipt.rawLogs)
          }) 
        })
      })
    })
    // it("should be able to get the latest USD/ETH price from chainlink", async () => {
    //     // const instance = await InsuranceFactory.deployed();

    //     // fund contract with enough ETH & LINK?
    //         // myContract.sendTransaction({from:web3.eth.coinbase,value:10000000000000000000})

    //     // OR need access to chainlink network?
    //         // deploy to rinkeby
    //         // or get local chainlink node ... 
    //         // or make mock 

    //     // console.log('instance ',instance)
    //     // console.log('insurance_factory', insurance_factory)

    //     const result = await instance.sendTransaction({from: accounts[0], value: 10000000000000000000})

    //     console.log('result - sending eth', result)

    //     // const return_obj = await InsuranceFactory.createContract('0x2Ec936D225AB1D3927ebe8fA92b905B99b97cc36', 300, 50, 100, 'Iowa', { from: accounts[0]})
    //     const return_obj = await insurance_factory.createContract('0x2Ec936D225AB1D3927ebe8fA92b905B99b97cc36', 300, 50, 100, 'Iowa', { from: accounts[0]})

    //     console.log('return_obj', return_obj)

    //     // const latestPrice = await instance.getLatestPrice.call();
    //     // console.log('latestPrice ',latestPrice)
    //     // assert.equal(typeof(latestPrice), uint256);
    // });
    
    // it("should call a function that depends on a linked library", async () => {
    //     const meta = await MetaCoin.deployed();
    //     const outCoinBalance = await meta.getBalance.call(accounts[0]);
    //     const metaCoinBalance = outCoinBalance.toNumber();
    //     const outCoinBalanceEth = await meta.getBalanceInEth.call(accounts[0]);
    //     const metaCoinEthBalance = outCoinBalanceEth.toNumber();
    //     assert.equal(metaCoinEthBalance, 2 * metaCoinBalance);
    // });
    
    // it("should send coin correctly", async () => {
    //     // Get initial balances of first and second account.
    //     const account_one = accounts[0];
    //     const account_two = accounts[1];
    //     let balance;
    
    //     const amount = 10;
    
    //     const instance = await MetaCoin.deployed();
    //     const meta = instance;
    
    //     balance = await meta.getBalance.call(account_one);
    //     const account_one_starting_balance = balance.toNumber();
    
    //     balance = await meta.getBalance.call(account_two);
    //     const account_two_starting_balance = balance.toNumber();
    //     await meta.sendCoin(account_two, amount, { from: account_one });
    
    //     balance = await meta.getBalance.call(account_one);
    //     const account_one_ending_balance = balance.toNumber();
    
    //     balance = await meta.getBalance.call(account_two);
    //     const account_two_ending_balance = balance.toNumber();
    
    //     assert.equal(
    //         account_one_ending_balance,
    //         account_one_starting_balance - amount,
    //         "Amount wasn't correctly taken from the sender"
    //     );
    // });
});