

// contract address on Ropsten:
// const factoryAddress = '0x7FA6FDA76F895c5E8D4caa2C83A212A2ED8B3036' old 
const factoryAddress = '0xf1026645032D24Dfa919912BABFF5e3A046807cE'

// add contract ABI from Remix:

/*
const factoryABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "ChainlinkCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "ChainlinkFulfilled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "ChainlinkRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Received",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "a",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "msg_value",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "contract_funded_amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_payoutValue",
				"type": "uint256"
			}
		],
		"name": "contractCreated",
		"type": "event"
	},
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "contracts",
		"outputs": [
			{
				"internalType": "contract InsuranceContract",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_client",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_duration",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_premium",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_payoutValue",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_cropLocation",
				"type": "string"
			}
		],
		"name": "createContract",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_contractAddress",
				"type": "address"
			}
		],
		"name": "getContractRainfall",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_contractAddress",
				"type": "address"
			}
		],
		"name": "getContractRequestCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLatestPrice",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_contractAddress",
				"type": "address"
			}
		],
		"name": "updateContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]
*/

const factoryABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "ChainlinkCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "ChainlinkFulfilled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "ChainlinkRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Received",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "a",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "msg_value",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "contract_funded_amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_payoutValue",
				"type": "uint256"
			}
		],
		"name": "contractCreated",
		"type": "event"
	},
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "contracts",
		"outputs": [
			{
				"internalType": "contract InsuranceContract",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_client",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_drought_threshold",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_duration",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_premium",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_payoutValue",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_cropLocation",
				"type": "string"
			}
		],
		"name": "createContract",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_contractAddress",
				"type": "address"
			}
		],
		"name": "getContractRainfall",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_contractAddress",
				"type": "address"
			}
		],
		"name": "getContractRequestCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLatestPrice",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_contractAddress",
				"type": "address"
			}
		],
		"name": "updateContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_client",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_drought_threshold",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_duration",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_premium",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_payoutValue",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_cropLocation",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_link",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_oraclePaymentAmount",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "ChainlinkCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "ChainlinkFulfilled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "ChainlinkRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Received",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "insurer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "client",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "duration",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "payoutValue",
				"type": "uint256"
			}
		],
		"name": "contractCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "block_timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "contract_balance",
				"type": "uint256"
			}
		],
		"name": "contractEnded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "block_timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "payoutValue",
				"type": "uint256"
			}
		],
		"name": "contractPaidOut",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "rainfall",
				"type": "uint256"
			}
		],
		"name": "dataRecieved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "requestId",
				"type": "bytes32"
			}
		],
		"name": "dataRequestSent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "rainfall",
				"type": "uint256"
			}
		],
		"name": "rainfallThresholdReset",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_requestId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "_rainfall",
				"type": "uint256"
			}
		],
		"name": "checkRainfallCallback",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getChainlinkToken",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractActive",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractPaid",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCurrentRainfall",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLatestPrice",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getRequestCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "updateContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

document.getElementById("contract-input-fields").style.visibility = "hidden";

// Using the 'load' event listener for Javascript to
// check if window.ethereum is available

window.addEventListener('load', function() {
  
  if (typeof window.ethereum !== 'undefined') {
    console.log('window.ethereum is enabled')
    if (window.ethereum.isMetaMask === true) {
      console.log('MetaMask is active')
      let mmDetected = document.getElementById('mm-detected')
      mmDetected.innerHTML += 'MetaMask Is Available!'

      // add in web3 here
      var web3 = new Web3(window.ethereum)

    } else {
      console.log('MetaMask is not available')
      let mmDetected = document.getElementById('mm-detected')
      mmDetected.innerHTML += 'MetaMask Not Available!'
      // let node = document.createTextNode('<p>MetaMask Not Available!<p>')
      // mmDetected.appendChild(node)
    }
  } else {
    console.log('window.ethereum is not found')
    let mmDetected = document.getElementById('mm-detected')
    mmDetected.innerHTML += '<p>MetaMask Not Available!<p>'
  }
})


var web3 = new Web3(window.ethereum)

// Grabbing the button object,  

const mmEnable = document.getElementById('mm-connect');

// since MetaMask has been detected, we know
// `ethereum` is an object, so we'll do the canonical
// MM request to connect the account. 
// 
// typically we only request access to MetaMask when we
// need the user to do something, but this is just for
// an example
 
mmEnable.onclick = async () => {
  await ethereum.request({ method: 'eth_requestAccounts'})
  // grab mm-current-account
  // and populate it with the current address
  var mmCurrentAccount = document.getElementById('mm-current-account');
  mmCurrentAccount.innerHTML = 'Current Account: ' + ethereum.selectedAddress
}

// grab the button for input to a contract:

const cc_Submit = document.getElementById('cc-input-button');

var contractAddress = 'undetermined';

cc_Submit.onclick = async () => {
  // grab value from input
  
  const ccClient = document.getElementById('cc-input-box-client').value;
  const ccDrought = document.getElementById('cc-input-box-drought-threshold').value; 
  const ccDuration = document.getElementById('cc-input-box-duration').value;
  const ccPremium = document.getElementById('cc-input-box-premium').value;
  const ccPayout = document.getElementById('cc-input-box-payout').value;
  const ccLocation = document.getElementById('cc-input-box-location').value;

  var web3 = new Web3(window.ethereum)

  // instantiate smart contract instance
  const InsuranceFactory = new web3.eth.Contract(factoryABI, factoryAddress)
  InsuranceFactory.setProvider(window.ethereum)

  console.log('ccClient', ccClient)
  console.log('InsuranceFactory',InsuranceFactory)

  // create new Insurance contract
  return_obj = await InsuranceFactory.methods.createContract(ccClient, ccDrought, ccDuration, ccPremium, ccPayout, ccLocation).send({from: ethereum.selectedAddress})
  contractAddress = return_obj.events.contractCreated.returnValues[0];
  console.log(return_obj)
  console.log('contract created at address', contractAddress)

  // return_obj = await InsuranceFactory.methods.owner().call()
  // console.log('result from InsuranceFactory.owner()', return_obj) 

  var mmApprovedAccount = document.getElementById('mm-approved-account');
  mmApprovedAccount.innerHTML = 'Approved Account: ' + return_obj
}

const ccGetAddress = document.getElementById('cc-get-address')

InsuranceContract = ''

ccGetAddress.onclick = async () => {

  const ccDisplayAddress = document.getElementById('cc-display-address')
  ccDisplayAddress.innerHTML = 'New Contract Address: ' + contractAddress

  const ccDisplayAdvice = document.getElementById('cc-display-advice')
  ccDisplayAdvice.innerHTML = 'NOTICE: be sure to fund the new insurance contract with LINK and ETH here: https://faucets.chain.link/rinkeby'

  if (contractAddress != 'undetermined') {
	document.getElementById("contract-input-fields").style.visibility = "visible";
  }
}

const ccUpdateContract = document.getElementById('update-contract')
ccUpdateContract.onclick = async () => {
	console.log('calling updateContract')
	var web3 = new Web3(window.ethereum)
	const InsuranceContract = new web3.eth.Contract(contractABI, contractAddress)
	InsuranceContract.setProvider(window.ethereum)
	// console.log('InsuranceContract', InsuranceContract)
	return_obj = await InsuranceContract.methods.updateContract().send({from: ethereum.selectedAddress})
	console.log('return_obj', return_obj)

	// return values from return_obj 
}

const ccGetRainfall = document.getElementById('get-current-rainfall')
ccGetRainfall.onclick = async () => {
	console.log('calling getRainfall')
	console.log('request')
	var web3 = new Web3(window.ethereum)
	const InsuranceContract = new web3.eth.Contract(contractABI, contractAddress)
	InsuranceContract.setProvider(window.ethereum)
	// console.log('InsuranceContract', InsuranceContract)
	return_obj = await InsuranceContract.methods.getCurrentRainfall().call({from: ethereum.selectedAddress})
	console.log('return_obj', return_obj)

	const ccDisplayRainfall = document.getElementById('cc-display-rainfall')
	ccDisplayRainfall.innerHTML = 'Current Rainfall: ' + return_obj
}

const ccGetRequestCount = document.getElementById('get-request-count')
ccGetRequestCount.onclick = async () => {
	console.log('calling getRequestCount')
	var web3 = new Web3(window.ethereum)
	const InsuranceContract = new web3.eth.Contract(contractABI, contractAddress)
	InsuranceContract.setProvider(window.ethereum)
	// console.log('InsuranceContract', InsuranceContract)
	return_obj = await InsuranceContract.methods.getRequestCount().call({from: ethereum.selectedAddress})
	console.log('return_obj', return_obj)

	const ccDisplayRequestCount = document.getElementById('cc-display-request-count')
	ccDisplayRequestCount.innerHTML = 'Request Count: ' + return_obj
}

const ccGetContractActive = document.getElementById('get-contract-active')
ccGetContractActive.onclick = async () => {
	console.log('calling ccGetContractActive')
	var web3 = new Web3(window.ethereum)
	const InsuranceContract = new web3.eth.Contract(contractABI, contractAddress)
	InsuranceContract.setProvider(window.ethereum)
	// console.log('InsuranceContract', InsuranceContract)
	return_obj = await InsuranceContract.methods.getContractActive().call({from: ethereum.selectedAddress})
	console.log('return_obj', return_obj)

	const ccDisplayContractActive = document.getElementById('cc-display-contract-active')
	ccDisplayContractActive.innerHTML = 'Contract Active: ' + return_obj
}

const ccGetContractPaid = document.getElementById('get-contract-paid')
ccGetContractPaid.onclick = async () => {
	console.log('calling ccGetContractPaid')
	var web3 = new Web3(window.ethereum)
	const InsuranceContract = new web3.eth.Contract(contractABI, contractAddress)
	InsuranceContract.setProvider(window.ethereum)
	// console.log('InsuranceContract', InsuranceContract)
	return_obj = await InsuranceContract.methods.getContractPaid().call({from: ethereum.selectedAddress})
	console.log('return_obj', return_obj)

	const ccDisplayContractPaid = document.getElementById('cc-display-contract-paid')
	ccDisplayContractPaid.innerHTML = 'Contract Paid: ' + return_obj
}


// next, provide interface to new contract 

// ccGetAddress.onclick = async () => {

//   var web3 = new Web3(window.ethereum)

//   const simpleStorage = new web3.eth.Contract(ssABI, ssAddress)
//   simpleStorage.setProvider(window.ethereum)

//   var value = await simpleStorage.methods.retrieve().call()

//   console.log(value)

//   const ssDisplayValue = document.getElementById('ss-display-value')

//   ssDisplayValue.innerHTML = 'Current Simple Storage Value: ' + value

// }