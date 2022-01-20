const InsuranceFactory = artifacts.require('InsuranceFactory')

module.exports = async (deployer, network, [defaultAccount]) => {
  // Local (development) networks need their own deployment of the LINK
  // token and the Oracle contract
  if (network.startsWith('rinkeby')) {
    // For kovan networks, use the 0 address to allow the ChainlinkRegistry
    // contract automatically retrieve the correct address for you
    deployer.deploy(InsuranceFactory, {from: defaultAccount})
  } else if (network.startsWith('development')) {
    deployer.deploy(InsuranceFactory, {from: defaultAccount}) // todo: may need to add defaultAccount
  } else {
    console.log('error with InsuranceFactory migration')
  }
}


