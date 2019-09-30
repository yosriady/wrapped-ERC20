pragma solidity 0.5.11;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "./interfaces/IERC20MintableBurnable.sol";
import "./interfaces/IExchange.sol";


/**
 * @dev Automated market maker to deposit ERC20 tokens and withdraw wrapped ERC20 tokens against.
*/
contract WrappedERC20Exchange is IExchange {
  using SafeERC20 for IERC20;

  event Deposited(address payee, uint amount);
  event Withdrawn(address payee, uint amount);

  IERC20 public token;
  IERC20MintableBurnable public wrappedToken;

  constructor (IERC20 _token, IERC20MintableBurnable _wrappedToken) public {
    token = _token;
    wrappedToken = _wrappedToken;
  }

  function deposit(uint _amount) public {
      emit Deposited(msg.sender, _amount);

      // msg.sender must have sufficient token allowance for address(this) to transferFrom
      token.transferFrom(msg.sender, address(this), _amount);

      // Mint an equivalent amount of wrapped token for each token
      wrappedToken.mint(msg.sender, _amount);
  }

  function withdraw(uint _amount) public {
      emit Withdrawn(msg.sender, _amount);

      token.transfer(msg.sender, _amount);

      // msg.sender must have approved sufficient wrappedToken allowance for address(this) to burn
      wrappedToken.burnFrom(msg.sender, _amount);
  }
}
