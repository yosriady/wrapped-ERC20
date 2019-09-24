pragma solidity 0.5.11;


import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "./interfaces/IExchange.sol";

contract WrappedERC20Exchange is IExchange {
  using SafeERC20 for IERC20;

  IERC20 public token;
  IERC20 public wrappedToken;

  // TODO: automated market maker to deposit tokens and withdraw wrapped tokens against

  constructor (IERC20 _token, IERC20 _wrappedToken) public {
    token = _token;
    wrappedToken = _wrappedToken;
  }

    function deposit(uint256 _amount) public {
        token.transferFrom(msg.sender, address(this), _amount);
        balanceOf[msg.sender] = balanceOf[msg.sender].add(_amount);
        emit Deposit(msg.sender, _amount);
        // TODO: wrappedToken.mint()
    }

    function withdraw(uint256 _amount) public {
        require(balanceOf[msg.sender] >= _amount);
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_amount);
        token.transfer(msg.sender, _amount);
        emit Withdrawal(msg.sender, _amount);
        // TODO: wrappedToken.burn()
    }
}
