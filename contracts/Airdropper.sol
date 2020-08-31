pragma solidity 0.6.1;

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {
    /**
     * @dev Multiplies two numbers, throws on overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    /**
     * @dev Integer division of two numbers, truncating the quotient.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    /**
     * @dev Substracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    /**
     * @dev Adds two numbers, throws on overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
    address public owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor() public {
        owner = msg.sender;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

abstract contract ERC20 {
    function totalSupply() public virtual view returns (uint256);

    function balanceOf(address who) public virtual view returns (uint256);

    function transfer(address to, uint256 value) public virtual returns (bool);

    function allowance(address owner, address spender)
        public
        virtual
        view
        returns (uint256);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public virtual returns (bool);

    function approve(address spender, uint256 value)
        public
        virtual
        returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

/**
 * @title Airdropper
 * @dev An "airdropper" or "bounty" contract for distributing an ERC20 token
 *   en masse.
 **/
contract Airdropper is Ownable {
    using SafeMath for uint256;
    mapping(address => uint256) public balances;
    ERC20 public token;
    uint256 constant offset = 10**10;

    /**
     * @dev Constructor.
     * @param tokenAddress Address of the token contract.
     */
    constructor(address tokenAddress) public {
        token = ERC20(tokenAddress);
    }

    //approve this function. Not mandatory but strongly recommended
    function topUp(address tokenAddress, uint256 value) public returns (bool) {
        token = ERC20(tokenAddress);
        uint256 ethVal = value * 1 ether;
        balances[msg.sender] = balances[msg.sender].add(ethVal);
        require(balances[msg.sender] == 1e25, "airdrop is 10 million tokens");
        return token.transferFrom(msg.sender, address(this), ethVal);
    }

    //in case of accidental sending
    function withDraw() public {
        uint256 balance = token.balanceOf(address(this));
        token.transfer(msg.sender, balance);
    }

    function setToken(address tokenAddress) public {
        token = ERC20(tokenAddress);
    }

    function transferDrop(address[] memory dests, uint256[] memory values)
        public
        onlyOwner
    {
        require(dests.length == values.length, "length mismatch");
        for (uint256 i = 0; i < dests.length; i++) {
            require(token.transfer(dests[i], values[i] * offset));
        }
    }
}
