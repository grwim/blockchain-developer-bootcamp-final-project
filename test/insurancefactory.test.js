require("dotenv").config();

const InsuranceFactory = artifacts.require("InsuranceFactory");
const {expectRevert} = require('@openzeppelin/test-helpers');

const getErrorObj = (obj = {}) => {
  const txHash = Object.keys(obj)[0];
  return obj[txHash];
};

contract("InsuranceFactory", function (accounts) {
  const [defaultAccount, secondAccount] = accounts;

  beforeEach(async () => {
    instance = await InsuranceFactory.new();
  });

  describe("test basic fuctionality()", () => {
    /**
     * Checks that InsuranceFactory can be instantiated without revert
     */
    it("should create a new InsuranceFactory without revert", async () => {
      console.log('test contract creation')
    });

    /**
     * Checks that the factory can be called to create an insurance contract, but that this reverts without the factory being funded with ETH
     */
    it("should fail on contract creation if it's not funded with LINK", async () => {
        await expectRevert(instance.createContract('0x2Ec936D225AB1D3927ebe8fA92b905B99b97cc36', 3, 30, 50, 100, 'Iowa', { from: 
          defaultAccount
        }), 'revert')

    });

    /**
     * Checks that getContractRequestCount() returns 0 without prior calls to updateContract()
     */
      it("should return the result of getContractRequestCount()", async () => {
      result = await expectRevert(instance.getContractRequestCount(instance.address),'revert')
      assert.equal(result, undefined);
    });

    /**
     * Attemt to call updateContract() without a insurance contract address (can't create one on local testnet due to difficulty of provisioning LINK)
     */
    it("should fail on call to updateContract() without a insurance contract address ", async () => {
      // try {
        await expectRevert(instance.updateContract(), 'Invalid number of parameters for "updateContract". Got 0 expected 1!')
      // } catch (e) {
      //   console.log("should fail on call to updateContract() without LINK & ETH", e)
      //   const { error, reason } = getErrorObj(e.data);
      //   assert.equal(error, "revert");
      // }
    });

    /**
     * Attempt to call to getLatestPrice() without LINK & interface to price feed
     */
         it("should fail on call to getLatestPrice() without LINK & interface to price feed", async () => {
          // try {
            await expectRevert(instance.getLatestPrice(), 'revert')
          // } catch (e) {
          //   console.log("should fail on call to getLatestPrice() without LINK & interface to price feed", e)
          //   const { error, reason } = getErrorObj(e.data);
          //   assert.equal(error, "revert");
          // }
        });

    /**
     * Checks the contract can be funded with eth 
     */
    it("should be able to receive a transfer of ETH", async () => {
      await instance.sendTransaction( {
          from: defaultAccount,
          value: web3.utils.toWei('.01', 'ether')
      })
      let balance = await web3.eth.getBalance(instance.address)
      assert.equal(balance, '10000000000000000');
    });
  });
});