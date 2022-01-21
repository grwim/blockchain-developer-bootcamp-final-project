pragma solidity ^0.8.9;

/// @title InsuranceContract -- Simple Weather Insurance
/// @author Konrad M. Rauscher
/// @notice You can use this contract for basic parametric weather insurance, according to rainfall 
/// @dev InsuranceContracts need to be funded with LINK sepperately (InsuranceFactory doesnt do so on createContract()
/// @custom:experimental This is an experimental contract.

// Open Zeppelin Imports
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// Truffle Imports
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

// uint constant MINUTE_IN_SECONDS = 60;
// uint constant HOUR_IN_SECONDS = 60 * MINUTE_IN_SECONDS;
// uint constant DAY_IN_SECONDS = 24 * HOUR_IN_SECONDS;
// uint constant WEEK_IN_SECONDS = 7 * DAY_IN_SECONDS;
// uint constant MONTH_IN_SECONDS = 30 * DAY_IN_SECONDS;
// uint constant YEAR_IN_SECONDS = 365 * DAY_IN_SECONDS;

uint constant DROUGHT_DAYS_THRESHOLD = 3;

contract InsuranceContract is ChainlinkClient, Ownable {

    using SafeMath for uint;
    using Chainlink for Chainlink.Request;
    AggregatorV3Interface pricefeed;
    
    uint public constant DAY_IN_SECONDS = 60; //How many seconds in a day. 60 for testing, 86400 for Production
    uint public constant DROUGHT_DAYS_THRESDHOLD = 3 ;  //Number of consecutive days without rainfall to be defined as a drought
    uint256 private oraclePaymentAmount;

    address payable public insurer;
    address payable client;
    uint startDate;
    uint duration;
    uint premium;
    uint payoutValue;
    string cropLocation;

    uint256[2] public currentRainfallList;
    bytes32[2] public jobIds;
    address[2] public oracles;
    
    string constant WORLD_WEATHER_ONLINE_URL = "http://api.worldweatheronline.com/premium/v1/weather.ashx?";
    string constant WORLD_WEATHER_ONLINE_KEY = "629c6dd09bbc4364b7a33810200911";
    string constant WORLD_WEATHER_ONLINE_PATH = "data.current_condition.0.precipMM";
    
    string constant OPEN_WEATHER_URL = "https://openweathermap.org/data/2.5/weather?";
    string constant OPEN_WEATHER_KEY = "b4e40205aeb3f27b74333393de24ca79";
    string constant OPEN_WEATHER_PATH = "rain.1h";
    
    string constant WEATHERBIT_URL = "https://api.weatherbit.io/v2.0/current?";
    string constant WEATHERBIT_KEY = "5e05aef07410401fac491b06eb9e8fc8";
    string constant WEATHERBIT_PATH = "data.0.precip";

    uint daysWithoutRain;                   //how many days there has been with 0 rain
    bool contractActive;                    //is the contract currently active, or has it ended
    bool contractPaid = false;
    uint currentRainfall = 0;               //what is the current rainfall for the location
    uint currentRainfallDateChecked = block.timestamp;  //when the last rainfall check was performed
    uint requestCount = 0;                  //how many requests for rainfall data have been made so far for this insurance contract
    uint dataRequestsSent = 0;             //variable used to determine if both requests have been sent or not

    uint lastCallTimeStamp = 0;
    
    AggregatorV3Interface internal priceFeed;

    // /**
    //  * @dev Prevents a function being run unless it's called by Insurance Provider
    //  */
    // modifier onlyOwner() override {
	// 	require(insurer == msg.sender,'Only Insurance provider can do this');
    //     _;
    // }

    /**
     * @dev Prevents a function being run unless contract is still active
     */
    modifier onContractActive() {
        // checks that a given InsuranceContract is still active
        require(contractActive == true ,'Contract has ended, cant interact with it anymore');
        _;
    }
    
    /**
     * @dev Prevents a function being run unless the Insurance Contract duration has been reached
     */
    modifier onContractEnded() {
        // checks that a given InsuranceContract is ended
        if((startDate + duration) <= block.timestamp) {
            _;
        }
    }
    
    /**
     * @dev Prevents a data request to be called unless it's been a day since the last call (to avoid spamming and spoofing results)
     * apply a tolerance of 2/24 of a day or 2 hours.
     */    
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
    event contractCreated(address insurer, address client, uint duration, uint premium, uint payoutValue);
    /// @notice emited on receipt of ETH
    event Received(address sender, uint amount);

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
    /// @param _premium - amount client pays for the insurance contract, in dollars
    /// @param _payoutValue - amount client recieves in event of insurance payout, in dollars
    /// @param _cropLocation - name of state, e.g. 
    constructor(address _client, uint _duration, uint _premium, uint _payoutValue, string memory _cropLocation, address _link, uint256 _oraclePaymentAmount) payable public {
        
        /**
         * Network: Rinkeby
         * Aggregator: ETH/USD
         * Address: 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
         */
        priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e); 

        // init vars needed for chainlink network interaction
        setChainlinkToken(_link);
        oraclePaymentAmount = _oraclePaymentAmount;

        // check that the contract has been fully funded
        require(msg.value >= _payoutValue.div(uint(getLatestPrice())), "Not enough funds sent to contract");

        // init values for the contract
        insurer = payable(msg.sender);
        client = payable(_client);
        // startDate = block.timestamp + DAY_IN_SECONDS; // effective date of contract starts on day after contract creation
        startDate = block.timestamp; // effective date of contract starts on day after contract creation
        duration = _duration;
        premium = _premium;
        payoutValue = _payoutValue;
        daysWithoutRain = 0;
        contractActive = true;
        cropLocation = _cropLocation;
        
        // oracle = 0x240BaE5A27233Fd3aC5440B5a598467725F7D1cd; // https://market.link/jobs/c17a49d6-8d88-4ff9-b27a-bd3d46d7efb9
        // jobId = '1bc4f827ff5942eaaa7540b7dd1e20b9';

        // set the oracles and jobids to values from nodes on market.link
        // oracles[0] = 0x240BaE5A27233Fd3aC5440B5a598467725F7D1cd;
        // oracles[1] = 0x5b4247e58fe5a54A116e4A3BE32b31BE7030C8A3;
        // jobIds[0] = '1bc4f827ff5942eaaa7540b7dd1e20b9';
        // jobIds[1] = 'e67ddf1f394d44e79a9a2132efd00050';

        oracles[0] = 0x1b666ad0d20bC4F35f218120d7ed1e2df60627cC;
        oracles[1] = 0x7F2b5771f47B3bBD2b5043c369Bf581fBd1804C7;
        jobIds[0] = '2d3cc1fdfede46a0830bbbf5c0de2528';
        jobIds[1] = 'c60471889fc4408f877733a831b7961e';

        emit contractCreated(insurer, client, duration, premium, payoutValue);
    }

    /**
     * @dev Calls out to an Oracle to obtain weather data
     */     
     function updateContract() public onContractActive() returns (bytes32 requestId) {
        // check that contract has not expired, if it hasn't then this function execution will resume
        checkEndContract();

        // check above may have updated contract's state (active or not)
        if (contractActive) {
            dataRequestsSent = 0;
            //First build up a request to World Weather Online to get the current rainfall
            string memory url = string(abi.encodePacked(WORLD_WEATHER_ONLINE_URL, "key=",WORLD_WEATHER_ONLINE_KEY,"&q=",cropLocation,"&format=json&num_of_days=1"));
            checkRainfall(oracles[0], jobIds[0], url, WORLD_WEATHER_ONLINE_PATH);

            // Now build up the second request to WeatherBit
            url = string(abi.encodePacked(WEATHERBIT_URL, "city=",cropLocation,"&key=",WEATHERBIT_KEY));
            checkRainfall(oracles[1], jobIds[1], url, WEATHERBIT_PATH);  
        }
    }

    /// @notice calls Chainlink weather oracle(s) to obtain weather data for specified location
    /// @param _oracle - address of the oracle
    /// @param _jobId - bytes32 id of job for oracle to run
    /// @param _url - url to weather data endpoint
    /// @param _path - path to parse rainfall amount from response
    function checkRainfall(address _oracle, bytes32 _jobId, string memory _url, string memory _path) private onContractActive() returns (bytes32 requestId) {
        
        Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.checkRainfallCallback.selector);

        req.add("get", _url);
        req.add("path", _path);
        req.addInt("times", 100); // multiply by 100, because solidity can't handle decimals 

        bytes32 requestId = sendChainlinkRequestTo(_oracle, req, oraclePaymentAmount);

        emit dataRequestSent(requestId);
    }

    /// @notice checks whether contract has finished yet. if it has, update contractActive
    function checkEndContract() private onContractEnded () {
        // insurer must have performed at least 1 weather call /day to retrieve funds back.
        // allow for 1 missed weather call, in case of unexpected issues on a given day.
        
        if (requestCount >= (duration.div(DAY_IN_SECONDS) - 2)) { // 
            //return funds back to insurance provider then end/kill the contract
            insurer.transfer(address(this).balance);
        } else { //insurer hasn't done the minimum number of data requests, client is eligible to receive his premium back
            // need to use ETH/USD price feed to calculate ETH amount
            client.transfer(premium.div(uint(getLatestPrice())));
            insurer.transfer(address(this).balance);
        }
        
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
        return requestCount;
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
    function checkRainfallCallback(bytes32 _requestId, uint256 _rainfall) public onContractActive() callFrequencyOncePerDay() {
    
        currentRainfallList[dataRequestsSent] = _rainfall; 
        dataRequestsSent = dataRequestsSent + 1;

        //set current rainfall to average of both values
       if (dataRequestsSent > 1) {
            currentRainfall = (currentRainfallList[0].add(currentRainfallList[1]).div(2));
            currentRainfallDateChecked = block.timestamp;
            requestCount +=1;

            if (_rainfall == 0) {
                daysWithoutRain += 1;
            } else { // there was rain, so reset daysWithoutRain
                daysWithoutRain = 0;
                emit rainfallThresholdReset(_rainfall);
            }

            if (daysWithoutRain >= DROUGHT_DAYS_THRESHOLD) {  //day threshold has been met
                // need to pay client out insurance amount
                payOutContract();
            }
       }

        emit dataRecieved(_rainfall);
    }

    /// @notice transfers payout amount to client, returns remaining funds (premium) back to Insurer, and marks contract as closed
    function payOutContract() private onContractActive() { 
        
        // transfer agreed payout value to client
        client.transfer(address(this).balance);
        // payable(client).transfer(payoutValue);

        // transfer remaining LINK back to insurer
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress()); 
        require(link.transfer(insurer, link.balanceOf(address(this))), "Transfer could not take place");
        
        // transfer remaining ETH back to insurer
        // payable(insurer).transfer(address(this).balance);

        emit contractPaidOut(block.timestamp, payoutValue);

        // mark contract as paid and no longer active
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