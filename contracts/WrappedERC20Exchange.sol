pragma solidity 0.5.11;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "./interfaces/IExchange.sol";

contract WrappedERC20Exchange is IExchange {
  using SafeERC20 for IERC20;

  event Deposited(address payee, uint amount);
  event Withdrawn(address payee, uint amount);

  IERC20 public token;
  IERC20 public wrappedToken;

  // TODO: automated market maker to deposit tokens and withdraw wrapped tokens against

  constructor (IERC20 _token, IERC20 _wrappedToken) public {
    token = _token;
    wrappedToken = _wrappedToken;
  }

    function deposit(uint _amount) public {
        token.transferFrom(msg.sender, address(this), _amount);
        emit Deposited(msg.sender, _amount);
        // TODO: wrappedToken.mint()
    }

    function withdraw(uint _amount) public {
        require(token.balanceOf(msg.sender) >= _amount, 'Cannot withdraw more than balance.');
        token.transfer(msg.sender, _amount);
        emit Withdrawn(msg.sender, _amount);
        // TODO: wrappedToken.burn()
    }
}
