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
  event ExchangeInitialized(address exchange, address caller);

  mapping(IERC20 => IERC20) public wrappedTokens; // Mapping of token address -> wrapped token address
  mapping(IERC20 => IExchange) public exchanges; // Mapping of token address -> exchange address

  function create(IERC20 _token) public {
    // Get name, symbol, and decimals directly from _token, via ERC20Detailed
    IERC20Metadata m = IERC20Metadata(_token)
    string wrappedName = string(abi.encodePacked("Wrapped", " ", m.name());
    string wrappedSymbol = string(abi.encodePacked("w", m.symbol()); // e.g. wPAY

    // Deploy Wrapped Token contract
    IERC20 wrappedToken = new WrappedERC20(
      wrappedName,
      wrappedSymbol,
      uint8(m.decimals()) // Conversion from old uint256 decimals to new uint8
    )
    wrappedTokens[_token] = wrappedToken;
    emit WrappedTokenCreated(_token, wrappedToken, wrappedSymbol);

    // Deploy Token <> Wrapped Token Exchange contract
    IExchange exchange = new WrappedERC20Exchange(
      _token,
      wrappedToken,
    )
    exchanges[_token] = exchange;
    emit ExchangeCreated(_token, exchange, wrappedSymbol);

    // TODO: handover roles
    // wrappedToken.addMinter(exchange);
    // wrappedToken.renounceMinter();
    // wrappedToken.addBurner(exchange);
    // wrappedToken.renounceBurner();
    emit ExchangeInitialized(exchange, msg.sender)
    
    // TODO: Checks-Effects-Interactions ok?
  }
}