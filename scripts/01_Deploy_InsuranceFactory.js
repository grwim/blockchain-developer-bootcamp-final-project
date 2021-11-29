let { networkConfig } = require('../helper-hardhat-config')

module.exports = async ({
    getNamedAccounts,
    deployments,
  }) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts()

    //Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
    //Default one below is ETH/USD contract on Kovan
    const PRICE_FEED_CONTRACT="0x9326BFA02ADD2366b30bacB125260Af641031331";

    console.log("----------------------------------------------------")
    console.log('Deploying InsuranceFactory');
      const InsuranceFactory = await deploy('InsuranceFactory', {
      from: deployer,
      gasLimit: 4000000,
    });

    await InsuranceFactory.deployed()
    console.log("InsuranceFactory deployed to: ", InsuranceFactory.address)
    console.log("Run Price Feed contract with command:")
    console.log("npx hardhat read-price-feed --contract ",InsuranceFactory.address)
  };

  module.exports.tags = ['all', 'feed', 'main']
