pragma solidity 0.5.11;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IERC20MintableBurnable.sol";
import "./interfaces/IExchange.sol";


/**
 * @dev Automated market maker to deposit ERC20 tokens and withdraw wrapped ERC20 tokens against.
*/
contract WrappedERC20Exchange is IExchange, ReentrancyGuard {
    using SafeERC20 for IERC20;

    event Deposited(address payee, uint amount);
    event Withdrawn(address payee, uint amount);

    IERC20 public token;
    IERC20MintableBurnable public wrappedToken;

    constructor (IERC20 _token, IERC20MintableBurnable _wrappedToken) public {
        token = _token;
        wrappedToken = _wrappedToken;
    }

    /**
    * @dev Wraps a specified amount of tokens into their wrapped counterpart.
    * Caller must have approved _amount allowance of unwrapped tokens for this exchange contract address to wrap.
    * @param _amount Amount of tokens to wrap.
    * @return true    
    */
    function deposit(uint _amount) public nonReentrant returns (bool) {
        require(_amount != 0, "Amount cannot be zero.");
        emit Deposited(msg.sender, _amount);

        // msg.sender must have sufficient token allowance for address(this) to transferFrom
        token.safeTransferFrom(msg.sender, address(this), _amount);

        // Mint an equivalent amount of wrapped token for each token
        wrappedToken.mint(msg.sender, _amount);

        return true;
    }

    /**
    * @dev Wraps a specified amount of tokens into their wrapped counterpart.
    * Source must have approved _amount allowance of unwrapped tokens for this exchange contract address to wrap.
    * @param _source Address holding unwrapped tokens.
    * @param _destination Address to receive wrapped tokens.
    * @param _amount Amount of tokens to wrap.
    * @return true    
    */
    function depositFrom(address _source, address _destination, uint _amount) public nonReentrant returns (bool) {
        require(_amount != 0, "Amount cannot be zero.");
        require(_source != address(0), "Source address cannot be a zero address.");
        require(_destination != address(0), "Destination address cannot be a zero address.");

        emit Deposited(_source, _amount);

        // _source address must have sufficient token allowance for address(this) to transferFrom
        token.safeTransferFrom(_source, address(this), _amount);

        // Mint an equivalent amount of wrapped token for each token
        wrappedToken.mint(_destination, _amount);

        return true;
    }

    /**
    * @dev Unwraps a specified amount of wrapped tokens into their original collateral.
    * Caller must have approved _amount allowance of wrapped tokens for this exchange contract address to unwrap.
    * @param _amount Amount of tokens to unwrap.
    * @return true    
    */
    function withdraw(uint _amount) public nonReentrant returns (bool) {
        require(_amount != 0, "Amount cannot be zero.");
        emit Withdrawn(msg.sender, _amount);

        // msg.sender must have approved sufficient wrappedToken allowance for address(this) to burn
        wrappedToken.burnFrom(msg.sender, _amount);

        // Release token to sender
        token.safeTransfer(msg.sender, _amount);

        return true;
    }

    /**
    * @dev Unwraps a specified amount of wrapped tokens into their original collateral.
    * Source must have approved _amount allowance of wrapped tokens for this exchange contract address to unwrap.
    * @param _source Address holding wrapped tokens.
    * @param _destination Address to receive unwrapped tokens.
    * @param _amount Amount of tokens to unwrap.
    * @return true
    */
    function withdrawFrom(address _source, address _destination, uint _amount) public nonReentrant returns (bool) {
        require(_amount != 0, "Amount cannot be zero.");
        require(_source != address(0), "Source address cannot be a zero address.");
        require(_destination != address(0), "Destination address cannot be a zero address.");

        emit Withdrawn(_source, _amount);

        // _source must have approved sufficient wrappedToken allowance for address(this) to burn
        wrappedToken.burnFrom(_source, _amount);

        // Release token to destination
        token.safeTransfer(_destination, _amount);

        return true;
    }

    /**
    * @dev Returns the total amount of deposited (unwrapped) tokens in the exchange contract.
    * @return uint Total amount of tokens
    */
    function supply() public view returns (uint) {
        return token.balanceOf(address(this));
    }
}
