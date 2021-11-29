pragma solidity ^0.8.9;

/// @title InsuranceContract -- Simple Weather Insurance
/// @author Konrad M. Rauscher
/// @notice You can use this contract for basic parametric weather insurance, according to rainfall 
/// @dev InsuranceContracts need to be funded with LINK sepperately (InsuranceFactory doesnt do so on createContract())
/// @custom:experimental This is an experimental contract.

// Open Zeppelin Imports
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// Truffle Imports
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

string constant WEATHERBIT_URL = "https://api.weatherbit.io/v2.0/current?";
string constant WEATHERBIT_KEY = "9ba8e169305f40269521e7e9cd20bbbb";
string constant WEATHERBIT_PATH = "data.0.precip";

uint constant MINUTE_IN_SECONDS = 60;
uint constant HOUR_IN_SECONDS = 60 * MINUTE_IN_SECONDS;
uint constant DAY_IN_SECONDS = 24 * HOUR_IN_SECONDS;
uint constant WEEK_IN_SECONDS = 7 * DAY_IN_SECONDS;
uint constant MONTH_IN_SECONDS = 30 * DAY_IN_SECONDS;
uint constant YEAR_IN_SECONDS = 365 * DAY_IN_SECONDS;

contract InsuranceContract is Ownable, ChainlinkClient {


    using SafeMath for uint;
    using Chainlink for Chainlink.Request;
    
    uint lastCallTimeStamp = 0;

    modifier ContractIsActive() {
        // checks that a given InsuranceContract is still active
        require(contractActive == true);
        _;
    }
    
    modifier onContractEnded() {
        // checks that a given InsuranceContract is ended
        if((startDate + duration) <= block.timestamp) {
            _;
        }
    }
    
    modifier callFrequencyOncePerDay() {
        // checks a given function is not called more than once in a day
        require((lastCallTimeStamp + DAY_IN_SECONDS) <=  block.timestamp);
        _;
        lastCallTimeStamp = block.timestamp;
    }
    
    /// @notice emited on data request sent to oracle
    event dataRequestSent(bytes32 requestId);
    /// @notice emited on ending of conctract
    event contractEnded(uint block_timestamp, uint contract_balance);
    /// @notice emited on data received from oracle
    event dataRecieved(uint256 rainfall);
    /// @notice emited on rainfallThresholdReset
    event rainfallThresholdReset(uint256 rainfall);
    /// @notice emited once contract has been paid out
    event contractPaidOut(uint block_timestamp, uint payoutValue);
    /// @notice emited on creation of the contract
    event contractCreated(address insurer, address client, uint duration, uint payoutValue);
    /// @notice emited on receipt of ETH
    event Received(address sender, uint amount);

    bool contractActive;
    bool contractPaid; 
    
    uint oraclePaymentAmount;

    address payable insurer;
    address payable client;
    uint256 startDate;
    uint duration;
    uint premium;
    uint payoutValue;
    uint daysWithoutRain;
    string cropLocation;
    uint drought_days_threshold;
    
    address oracle; 
    bytes32 jobId;

    uint dataRequestCount;
    
    uint currentRainfall;

    mapping(uint => address) oracles;
    mapping(uint => string) jobIds;
    
    AggregatorV3Interface internal priceFeed;

    /// @notice returns the latest ETH/USD price
    /// @return ETH/USD price as uint
    function getLatestPrice() public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }

    /// @notice instantiates a new InsuranceContract
    /// @param _client - address of the client
    /// @param _duration - the length of the contract (60 seconds = 1 day for testing purposes; e.g. 300 --> 5 days)
    /// @param _drought_threshold - number of days without rain until considered drought
    /// @param _premium - amount client pays for the insurance contract -- multiplied by 100000000, so $100 is 10000000000
    /// @param _payoutValue - amount client recieves in event of insurance payout -- multiplied by 100000000, so $100 is 10000000000
    /// @param _cropLocation - name of state, e.g. Iowa
    constructor(address _client, uint _drought_threshold, uint _duration, uint _premium, uint _payoutValue, string memory _cropLocation, address _link, uint256 _oraclePaymentAmount) payable Ownable() public {
        
        /**
         * Network: Rinkeby
         * Aggregator: ETH/USD
         * Address: 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
         */
        priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e); 

        // init vars needed for chainlink node interaction
        setChainlinkToken(_link);
        oraclePaymentAmount = _oraclePaymentAmount;

        // check that the contract has been fully funded
        // require(msg.value >= _payoutValue.div(uint(getLatestPrice())), "Not enough funds sent to contract");

        // init values for the contract
        insurer = payable(msg.sender);
        client = payable(_client);
        startDate = block.timestamp + DAY_IN_SECONDS; // effective date of contract starts on day after contract creation
        duration = _duration;
        premium = _premium;
        payoutValue = _payoutValue;
        daysWithoutRain = 0;
        contractActive = true;
        cropLocation = _cropLocation;
        
        drought_days_threshold = _drought_threshold;

        oracle = 0x240BaE5A27233Fd3aC5440B5a598467725F7D1cd; // https://market.link/jobs/c17a49d6-8d88-4ff9-b27a-bd3d46d7efb9
        jobId = '1bc4f827ff5942eaaa7540b7dd1e20b9';

        dataRequestCount = 0;

        contractActive = true;
        contractPaid = false; 

        emit contractCreated(insurer, client, duration, payoutValue);
    }

    /// @notice attempts to update state; checks if a payment threshold has been triggered, or the contract period has ended 
    function updateContract() public ContractIsActive() /* returns (bytes32 requestId) */ {
        // check that contract has not expired
        dataRequestCount += 1;
    
        checkEndContract();

        // check above may have updated contract's state (active or not)
        if (contractActive) {
            // https://api.weatherbit.io/v2.0/current?lat=35.7796&lon=-78.6382&key=API_KEY&include=minutely
            string memory url = string(abi.encodePacked(WEATHERBIT_URL, "key=",WEATHERBIT_KEY,"&q=",cropLocation,"&format=json&num_of_days=1"));
            checkRainfall(oracle, jobId, url, WEATHERBIT_PATH); // oracle, jobId, url, PATH
        }
    }

    /// @notice calls Chainlink weather oracle(s) to obtain weather data for specified location
    /// @param _oracle - address of the oracle
    /// @param _jobId - bytes32 id of job for oracle to run
    /// @param _url - url to weather data endpoint
    /// @param _path - path to parse rainfall amount from response
    function checkRainfall(address _oracle, bytes32 _jobId, string memory _url, string memory _path) private ContractIsActive() /* returns (bytes32 requestId) */ {
        
        Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.checkRainfallCallback.selector);

        req.add("get", _url);
        req.add("path", _path);
        req.addInt("times", 100); // multiply by 100, because solidity can't handle decimals 

        bytes32 requestId = sendChainlinkRequestTo(_oracle, req, oraclePaymentAmount);

        emit dataRequestSent(requestId);
    }

    /// @notice checks whether contract has finished yet. if it has, update contractActive
    function checkEndContract() private onContractEnded () {
        //insurer must have performed at least 1 weather call /day to retrieve funds back.
        //allow for 1 missed weather call, in case of unexpected issues on a given day.
        // 
        // if (dataRequestCount >= (duration.div(DAY_IN_SECONDS) - 1)) { TODO -- SOMETHING BROKEN HERE -- 
        //     //return funds back to insurance provider then end/kill the contract
        //     insurer.transfer(address(this).balance);
        // } else { //insurer hasn't done the minimum number of data requests, client is eligible to receive his premium back
        //     client.transfer(premium.div(uint(getLatestPrice())));
        //     insurer.transfer(address(this).balance);
        // }
        
        // For now, simply return any remaining funds to the insurer once the contract term has ended
        insurer.transfer(address(this).balance);
        
        //transfer any remaining LINK tokens back to the insurer
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(insurer, link.balanceOf(address(this))), "Unable to transfer remaining LINK tokens");
        
        //mark contract as ended, so no future state changes can occur on the contract
        contractActive = false;
        
        // log ending of contract, with block timestamp and remaining balance
        emit contractEnded(block.timestamp, address(this).balance);
    }

    /// @notice returns number of data requests that have successfully made it back to the insurance contract
    function getRequestCount() public returns(uint) {
        return dataRequestCount;
    }
    
    /// @notice returns the current rainfall amount (in millimeters)
    function getCurrentRainfall() public returns(uint) {
        return currentRainfall;
    }

    /// @notice returns the contract active status (bool)
    function getContractActive() public returns(bool) {
        return contractActive;
    }

    /// @notice returns the contract paid status (bool)
    function getContractPaid() public returns(bool) {
        return contractPaid;
    }

    /// @notice to be called when the Chainlink weather oracle(s) send a response back. 
    /// @notice updates contract state with latest rainfall data & checks if payout condition has been met
    function checkRainfallCallback(bytes32 _requestId, uint256 _rainfall) public ContractIsActive() callFrequencyOncePerDay() {
        // validateChainlinkCallback(_requestId);
        // currentRainfallList[dataRequestSent] = _rainfall;
        // dataRequestsSent = dataRequestsSent + 1;
        // todo -- update to support more than one data source
        
        currentRainfall = _rainfall;

        emit dataRecieved(_rainfall);

        if (_rainfall == 0) {
            daysWithoutRain += 1;
        } else { // there was rain, so reset daysWithoutRain
            daysWithoutRain = 0;
            emit rainfallThresholdReset(_rainfall);
        }

        if (daysWithoutRain >= drought_days_threshold) {
            payOutContract();
        }
    }

    /// @notice transfers payout amount to client, returns remaining funds (premium) back to Insurer, and marks contract as closed
    function payOutContract() private ContractIsActive() { 
        
        // todo require checks for other transfers

        // transfer agreed payout value to client
        // client.transfer(address(this).balance);
        payable(client).transfer(payoutValue);

        // transfer remaining LINK back to insurer
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress()); 
        require(link.transfer(insurer, link.balanceOf(address(this))), "Transfer could not take place");
        // transfer remaining LINK back to insurer
        payable(insurer).transfer(address(this).balance);

        emit contractPaidOut(block.timestamp, payoutValue);

        // mark contract as no longer active
        contractPaid = true;
        contractActive = false; 
    }
    
    /**
    * @notice Returns the address of the LINK token
    * @dev This is the public implementation for chainlinkTokenAddress, which is
    * an internal method of the ChainlinkClient contract
    */
    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    /// @notice for handling calls that attempt to send ether
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}