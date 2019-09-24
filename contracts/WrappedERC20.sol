pragma solidity 0.5.11;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";


contract WrappedERC20 is ERC20, ERC20Mintable, ERC20Burnable, ERC20Detailed {
  // TODO: must be mintable and burnable
  // minterRole and burnerRole is solely the exchange contract
  // deployer must renounce role for minting and burning in factory.create()

  constructor (string memory name, string memory symbol, uint8 decimals)
      public
      ERC20Detailed(name, symbol, decimals)
  {
      // solhint-disable-previous-line no-empty-blocks
  }
}