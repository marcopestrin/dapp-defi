pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    uint public transactionCount = 0;
    string public name = "Dapp Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => uint) public daiTokenBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    struct Transaction {
        uint amount;
        address payable author;
        string description;
        string hash;
        uint id;
    }

    event TransactionCreated(
        uint id,
        address payable author,
        string description,
        string hash
    );


    function unstakeTokens(uint _amount, string memory _hashTransaction, string memory _description) public {
        // Require amount greater than 0 and less than token already staked
        require(_amount > 0, "amount cannot be 0");
        // TO FIX!
        // require(_amount > daiTokenBalance, "import to high");
        // Make sure description and hash exists
        require(bytes(_description).length > 0, "description cannot be empty");
        require(bytes(_hashTransaction).length > 0, "Hash cannot be empty");
        
        // Transfer Mock Dai tokens to this contract for staking
        // (msg.sender: is the user that call this function )
        // TO FIX!
        // daiToken.transferFrom(address(this), msg.sender, _amount);
        daiToken.transfer(msg.sender, _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] - _amount;
        daiTokenBalance[msg.sender] = daiTokenBalance[msg.sender] + _amount;

        transactionCount++;
    }

    function stakeTokens(uint _amount, string memory _hashTransaction, string memory _description) public {
        // Require amount greater than 0
        require(_amount > 0, "amount cannot be 0");
        // Make sure description and hash exists
        require(bytes(_description).length > 0, "description cannot be empty");
        require(bytes(_hashTransaction).length > 0, "Hash cannot be empty");
        // make sure author exists
        require(msg.sender != address(0x0));

        // Transfer Mock Dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add user to stakers array only if they haven't staked already
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;

        // Increment the transaction counter
        transactionCount++;

        // trigger an event
        // I need this to have the data into response inside logs.args 
        emit TransactionCreated(transactionCount, msg.sender, _description, _hashTransaction);
    }

    // Withdraw Tokens
    function withdrawTokens() public {
        // Fetch staking balance
        uint balance = stakingBalance[msg.sender];

        // Require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");

        // Transfer Mock Dai tokens to this contract for staking
        daiToken.transfer(msg.sender, balance);

        // Reset staking balance
        stakingBalance[msg.sender] = 0;

        // Update staking status
        isStaking[msg.sender] = false;

        transactionCount++;
    }

    // Issuing Tokens
    function issueTokens() public {
        // Only owner can call this function
        require(msg.sender == owner, "caller must be the owner");

        // Issue tokens to all stakers
        for (uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }
}
