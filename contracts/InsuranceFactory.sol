pragma solidity ^0.8.9;

/// @title InsuranceFactory -- Simple Weather Insurance
/// @author Konrad M. Rauscher
/// @notice You can use this contract to create and manage InsuranceContracts
/// @dev InsuranceFactories need to be funded with LINK and ETH -- https://faucets.chain.link/rinkeby

// Open Zeppelin Imports
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// Truffle Imports
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

import "./InsuranceContract.sol";

// import "hardhat/console.sol";



// responsible for generating new InsuranceContracts
// will fund each generated insurance contract with enough ETH and LINK so that once generated, each insurance contract can perform all required operations throughout their
contract InsuranceFactory is ChainlinkClient { 
    
    using SafeMath for uint;

    uint public constant DAY_IN_SECONDS = 60; //How many seconds in a day. 60 for testing, 86400 for Production
    address public insurer = msg.sender;
    AggregatorV3Interface internal priceFeed;
    uint constant ORACLE_PAYMENT = 0.1 * 10 ** 18; // 0.1 LINK
    // uint constant ORACLE_PAYMENT = 0.1 * 10 ** 17; // 0.01 LINK *

    address constant LINK_RINKEBY = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;

    /// @notice stores insurance contracts
    mapping(address => InsuranceContract) public contracts;
    
    function getLatestPrice() public view returns (int) { ///
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        require(timeStamp > 0, "Round not complete");
        return price;
    }

    /// @notice emited on creation of an InsuranceContract
    event contractCreated(address _insuranceContract, uint _premium, uint _payoutValue);
    /// @notice emited on receipt of ETH
    event Received(address sender, uint amount);
    /// @notice emited on call to get contractRainfall
    event contractRainfall(uint amount_rainfall);

    /// @notice initializes the Chainlink ETH/USD price feed
    /// @dev sets up a chainlink price feed on Rinkeby
    constructor() {
        /**
         * Network: Rinkeby
         * Aggregator: ETH/USD
         * Address: 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
         */
        priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e); 
    }

    /// @notice creates new InsuranceContract from required inputs and sends an amount of ETH equal to the payout value, so that the contract is fully funded 
    /// @param _client - address of the client
    /// @param _duration - the length of the contract (60 seconds = 1 day for testing purposes; e.g. 300 --> 5 days)
    /// @param _premium - amount client pays for the insurance contract -- multiplied by 100000000, so $100 is 10000000000
    /// @param _payoutValue - amount client recieves in event of insurance payout -- multiplied by 100000000, so $100 is 10000000000
    /// @param _cropLocation - name of state, e.g. Iowa
    /// @dev Returns _address - of new contract
    function createContract(address _client, uint _duration, uint _premium, uint _payoutValue, string memory _cropLocation) public payable /* onlyOwner() */ returns(address) {
        
        // create contract, send payout amount so fully funded (ETH) plus a small buffer
        uint funding_amount = (_payoutValue * 1 ether).div(uint(getLatestPrice())); // convert dollar amount into weth amount
        InsuranceContract new_contract = (new InsuranceContract){ value: funding_amount }(_client, _duration, _premium, _payoutValue, _cropLocation, LINK_RINKEBY, ORACLE_PAYMENT);
        // InsuranceContract new_contract = (new InsuranceContract)(_client, DROUGHT_THRESHOLD, _duration, _premium, _payoutValue, _cropLocation, LINK_RINKEBY, ORACLE_PAYMENT);

        // add contract to Map of contracts 
        contracts[address(new_contract)] = new_contract; 

        emit contractCreated(address(new_contract), funding_amount, _payoutValue);

        // fund contract with enough LINK tokens to fund oracle calls for duration (1 request/day + buffer)
        LinkTokenInterface link = LinkTokenInterface(new_contract.getChainlinkToken()); // setup LinkTokenInterface to new Contract
        
        link.transfer(address(new_contract), ((_duration.div(DAY_IN_SECONDS)) + 2) * ORACLE_PAYMENT);

        // @dev link.transfer() reverts on values above 0 -- transfer link to new contract through other means  (truffle tests, LINK faucet) for now, after contract creation
        // uint link_amount = ((_duration.div(DAY_IN_SECONDS)) + 2) * ORACLE_PAYMENT;
        // uint link_amount = ORACLE_PAYMENT * 5;
        // link.transfer(address(new_contract), 0);
        // --> have to make sure InsuranceFactory is funded with ETH & LINK
    
        return address(new_contract);
    }
    
    /// @notice sends link to the specified insuranceContract
    /// @param _contractAddress - address of an insurance contract
    function sendLink(address payable _contractAddress) public {
        InsuranceContract insurance_contract = InsuranceContract(_contractAddress);
        
        LinkTokenInterface link = LinkTokenInterface(insurance_contract.getChainlinkToken()); 
        require(link.transfer(address(insurance_contract), ORACLE_PAYMENT), "Transfer of LINK to insurannce contract could not take place");
    }

    /// @notice gets rainfall of the contract (from oracle) -- this value is the amount of rainfall recorded at the last oracle call 
    /// @param _contractAddress - address of an insurance contract
    function getContractRainfall(address payable _contractAddress) public returns(uint) {
        InsuranceContract i = InsuranceContract(_contractAddress);
        uint current_rainfall = i.getCurrentRainfall();
        emit contractRainfall(current_rainfall);
        return current_rainfall;
    }
    
    // todo -- may want to include a getter for (daysWithoutRain)

    /// @notice gets number of getContractRainfall requests, used to validate enough calls have been made
    /// @param _contractAddress - address of an insurance contract
    function getContractRequestCount(address payable _contractAddress) public returns(uint) {
        InsuranceContract i = InsuranceContract(_contractAddress);
        return i.getRequestCount();
    }

    /// @notice attempts to update state of specified contract; checks if a payment threshold has been triggered, or the contract period has ended 
    /// @param _contractAddress - address of an insurance contract
    function updateContract(address payable _contractAddress) external {
        InsuranceContract i = InsuranceContract(_contractAddress);
        i.updateContract();
    }
    
    /// @notice for handling calls that attempt to send ether
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
    
    /// @notice for handling calls that attempt to send ether
    fallback() external payable {
        emit Received(msg.sender, msg.value);
    }
}

