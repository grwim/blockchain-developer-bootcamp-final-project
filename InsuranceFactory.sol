pragma solidity ^0.8.9;

// Open Zeppelin Imports
import "@openzeppelin/contracts/ownership/Ownable.sol";

// Truffle Imports
import "chainlink/contracts/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "chainlink/contracts/ChainlinkClient.sol";

modifier onContractActive() {
    // checks that a given InsuranceContract is still active
    _
}

// responsible for generating new InsuranceContracts
// will fund each generated insurance contract with enough ETH and LINK so that once generated, each insurance contract can perform all required operations throughout their
contract InsuranceFactory { 

    /// @notice stores insurance contracts
    mapping (address => InsuranceContract) contracts;

    /// @notice initializes the Chainlink ETH/USD price feed
    constructor() {
        priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
    }

    /// @notice creates new InsuranceContract from required inputs and sends an amount of ETH equal to the payout value, so that the contract is fully funded 
    /// @param _client
    /// @param _drought_threshold
    /// @param _duration
    /// @param _premium
    /// @param _payoutValue
    /// @param _cropLocation
    /// @returns address 
    createContract(address _client, uint _drought_threshold, uint _duration, uint _premium, _payoutValue, string _cropLocation) public payable onlyOwner() returns(address) {
        
        // create contract, send payout amount so fully funded (ETH)
        funding_amount = (_payoutValue * 1 ether).div(uint(getLatestPrice()))
        InsuranceContract new_contract = (new InsuranceContract).value(funding_amount)(_client, _duration, _premium, _payoutValue, _cropLocation, LINK_KOVAN, ORACLE_PAYMENT)
        
        // add conntract to Map of contracts 
        contracts[address(new_contract)] = new_contract; 

        // TODO emit event

        // fund contract with enough LINK tokens to fund oracle calls for duration (1/day + buffer)
        LinkTokenInterface link = LinkTokenInterface(new_contract.getChainlinkToken()); // setup LinkTokenInterface to new Contract
        
        // TODO double check math for link amount 
        // link_amount = ((_duration.div(DAY_IN_SECONDS)) + 2) * ORACLE_PAYMENT.mul(2);
        link_amount = ((_duration + 2) * ORACLE_PAYMENT.mul(2);
        link.transfer(address(new_contract), link_amount);

        return address(new_contract);
    }

    /// @notice gets rainfall of the contract (from oracle)
    getContractRainfall(address _contractAddress) {
        InsuranceContract i = InsuranceContract(_contractAddress);
        return i.checkRainfall();
    }

    /// @notice gets number of getContractRainfall requests, used to validate enough calls have been made
    getContractRequestCount(address _contractAddress) {
        InsuranceContract i = InsuranceContract(_contractAddress);
        return i.getRequestCount();
    }

    /// @notice attempts to update state of specified contract; checks if a payment threshold has been triggered, or the contract period has ended 
    updateContract(address _contractAddress) external {
        InsuranceContract i = InsuranceContract(_contractAddress);
        i.updateContract();
    }
}


contract InsuranceContract {

    /// @notice instantiates a new InsuranceContract
    /// @param _client
    /// @param _duration
    /// @param _drought_threshold
    /// @param _premium
    /// @param _payoutValue
    /// @param _cropLocation
    constructor(address _client, uint _drought_threshold, uint _duration, uint _premium, _payoutValue, string _cropLocation) {}

    /// @notice attempts to update state; checks if a payment threshold has been triggered, or the contract period has ended 
    updateContract() {}

    /// @notice calls Chainlink weather oracle(s) to obtain weather data for specified location
    checkRainfall() {}

    /// @notice returns number of data requests that have successfully made it back to the insurance contract
    getRequestCount() {}

    /// @notice to be called when the Chainlink weather oracle(s) send a response back. 
    /// @notice updates contract state with latest rainfall data & checks if payout condition has been met
    checkRainfallCallback() {}

    /// @notice tranfers payour amount to client, returns remaining funds (premium) back to Insurer, and marks contract as closed
    payOutContract() {}
}

