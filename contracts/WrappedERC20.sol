pragma solidity 0.5.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";


/**
 * @dev Mintable and Burnable standard ERC20 token.
*/
contract WrappedERC20 is ERC20, ERC20Mintable, ERC20Burnable, ERC20Detailed {
  constructor (string memory name, string memory symbol, uint8 decimals)
      public
      ERC20Detailed(name, symbol, decimals)
  {
      // solhint-disable-previous-line no-empty-blocks
  }
}