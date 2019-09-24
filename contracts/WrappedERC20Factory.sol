pragma solidity 0.5.11;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "./interfaces/IExchange.sol";
import "./interfaces/IERC20Metadata.sol";
import "./WrappedERC20.sol";
import "./WrappedERC20Exchange.sol";

contract WrappedERC20Factory {
  using SafeERC20 for IERC20;

  event WrappedTokenCreated(address originalToken, address wrappedToken, string symbol);
  event ExchangeCreated(address originalToken, address exchange, string symbol);

  mapping(IERC20 => IERC20) public wrappedTokens; // Mapping of token address -> wrapped token address
  mapping(IERC20 => IExchange) public exchanges; // Mapping of token address -> exchange address

  function create(IERC20 _token) public {
    IERC20Metadata m = IERC20Metadata(_token)
    // TODO: get name, symbol, and decimals directly from _token, via ERC20Detailed

    string wrappedName = string(abi.encodePacked("Wrapped", " ", m.name());
    string wrappedSymbol = string(abi.encodePacked("w", m.symbol()); // e.g. wPAY

    IERC20 wrappedToken = new WrappedERC20(
      wrappedName,
      wrappedSymbol,
      uint8(m.decimals()) // Conversion from old uint256 decimals to new uint8
    )
    wrappedTokens[_token] = wrappedToken;
    emit WrappedTokenCreated(_token, wrappedToken, wrappedSymbol);

    IExchange exchange = new WrappedERC20Exchange(
      _token,
      wrappedToken,
    )
    exchanges[_token] = exchange;
    emit ExchangeCreated(_token, exchange, wrappedSymbol);
    
    // TODO: Checks-Effects-Interactions ok?
  }
}